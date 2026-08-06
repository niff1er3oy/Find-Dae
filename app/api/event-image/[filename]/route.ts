import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
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

    let fileBuffer: Buffer;
    let contentType: string;
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

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Event Image serve error:', error);
    return new NextResponse('Not found', { status: 404 });
  }
}
