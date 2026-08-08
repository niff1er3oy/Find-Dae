import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { EVENTS_UPLOAD_DIR as UPLOAD_DIR_BASE } from '@/lib/uploadDirs';
import { getWebpPath } from '@/lib/webp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string, filename: string }> }
) {
  try {
    const { eventId, filename } = await params;
    const wantsOriginal = request.nextUrl.searchParams.get('original') === '1';

    // Protect against directory traversal attacks
    const safeEventId = path.normalize(eventId).replace(/^(\.\.(\/|\\|$))+/, '');
    const safeFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');

    const filePath = path.join(UPLOAD_DIR_BASE, safeEventId, safeFilename);
    const ext = path.extname(safeFilename).toLowerCase();
    const webpPath = getWebpPath(filePath);

    let servedPath = filePath;
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';

    if (!wantsOriginal && webpPath && webpPath !== filePath) {
      // เวอร์ชันแสดงผล: ลองไฟล์ .webp คู่กันก่อนเพราะโหลดเร็วกว่า
      // ไม่มี .webp (เช่นรูปเก่าก่อนมีฟีเจอร์นี้ หรือแปลงตอนอัปโหลดไม่สำเร็จ) — fallback ไปไฟล์ต้นฉบับ
      try {
        await stat(webpPath);
        servedPath = webpPath;
        contentType = 'image/webp';
      } catch {
        // เก็บ servedPath/contentType เป็นไฟล์ต้นฉบับตามค่าเริ่มต้น
      }
    }

    const fileStat = await stat(servedPath);
    // ETag ผูกกับไฟล์ที่ served จริง (path + ขนาด + เวลาแก้ไข) แทนการแคชแบบ fixed TTL
    // เพราะ URL เดียวกันนี้อาจ serve เนื้อหาคนละไฟล์ได้ในเวลาต่างกัน (ต้นฉบับ -> webp เมื่อสร้างเสร็จทีหลัง)
    // ถ้าใช้ max-age แบบเดิม browser ที่แคชต้นฉบับไว้ก่อน webp จะเกิดจะไม่มีทางรู้ว่าไฟล์เปลี่ยนจนกว่าแคชจะหมดอายุ
    const etag = `"${servedPath}-${fileStat.size}-${fileStat.mtimeMs}"`;
    const cacheControl = 'public, max-age=0, must-revalidate';

    if (request.headers.get('if-none-match') === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: { 'ETag': etag, 'Cache-Control': cacheControl },
      });
    }

    const fileBuffer = await readFile(servedPath);

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'ETag': etag,
        'Last-Modified': fileStat.mtime.toUTCString(),
        ...(wantsOriginal ? { 'Content-Disposition': `attachment; filename="${safeFilename}"` } : {}),
      },
    });
  } catch (error) {
    console.error('Event Photo API serve error:', error);
    return new NextResponse('Not found', { status: 404 });
  }
}
