import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
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

    let fileBuffer: Buffer;
    let contentType: string;
    if (wantsOriginal) {
      // ดาวน์โหลด: ขอไฟล์ต้นฉบับตรงๆ ไม่เอา .webp ที่ย่อขนาด/ลดคุณภาพไว้สำหรับแสดงผล
      fileBuffer = await readFile(filePath);
      contentType = 'image/jpeg';
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.webp') contentType = 'image/webp';
    } else {
      try {
        // เวอร์ชันแสดงผล: ลองไฟล์ .webp คู่กันก่อนเพราะโหลดเร็วกว่า
        if (!webpPath || webpPath === filePath) throw new Error('no distinct webp path');
        fileBuffer = await readFile(webpPath);
        contentType = 'image/webp';
      } catch {
        // ไม่มี .webp (เช่นรูปเก่าก่อนมีฟีเจอร์นี้) — fallback ไปไฟล์ต้นฉบับ
        fileBuffer = await readFile(filePath);
        contentType = 'image/jpeg';
        if (ext === '.png') contentType = 'image/png';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.webp') contentType = 'image/webp';
      }
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // 1 day cache
        ...(wantsOriginal ? { 'Content-Disposition': `attachment; filename="${safeFilename}"` } : {}),
      },
    });
  } catch (error) {
    console.error('Event Photo API serve error:', error);
    return new NextResponse('Not found', { status: 404 });
  }
}
