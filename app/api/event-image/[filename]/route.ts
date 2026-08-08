import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { EVENTS_UPLOAD_DIR as UPLOAD_DIR } from '@/lib/uploadDirs';
import { getWebpPath } from '@/lib/webp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Protect against directory traversal attacks
    const safeFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');
    const filePath = path.join(UPLOAD_DIR, safeFilename);
    const ext = path.extname(safeFilename).toLowerCase();
    const webpPath = getWebpPath(filePath);

    let servedPath = filePath;
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';

    if (webpPath && webpPath !== filePath) {
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
    // ETag ผูกกับไฟล์ที่ served จริงแทนการแคชแบบ fixed TTL — URL เดียวกันอาจ serve
    // คนละไฟล์ได้เมื่อเวลาผ่านไป (ต้นฉบับ -> webp เมื่อสร้างเสร็จทีหลัง)
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
      },
    });
  } catch (error) {
    console.error('Event Image serve error:', error);
    return new NextResponse('Not found', { status: 404 });
  }
}
