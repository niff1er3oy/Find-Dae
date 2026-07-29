import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { EVENTS_UPLOAD_DIR as UPLOAD_DIR_BASE } from '@/lib/uploadDirs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string, filename: string }> }
) {
  try {
    const { eventId, filename } = await params;
    
    // Protect against directory traversal attacks
    const safeEventId = path.normalize(eventId).replace(/^(\.\.(\/|\\|$))+/, '');
    const safeFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');
    
    const filePath = path.join(UPLOAD_DIR_BASE, safeEventId, safeFilename);

    const fileBuffer = await readFile(filePath);
    
    const ext = path.extname(safeFilename).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // 1 day cache
      },
    });
  } catch (error) {
    console.error('Event Photo API serve error:', error);
    return new NextResponse('Not found', { status: 404 });
  }
}
