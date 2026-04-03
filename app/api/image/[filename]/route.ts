import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = 'D:\\find_dae_photos\\member';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Protect against directory traversal attacks
    let safeFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');

    // Allow empty or 'default-profile.png' directly to use the disk default profile
    if (!safeFilename || safeFilename.trim() === '') {
       safeFilename = 'default-profile.png';
    }

    const filePath = path.join(UPLOAD_DIR, safeFilename);
    const fileBuffer = await readFile(filePath);
    
    const ext = path.extname(safeFilename).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Image serve error:', error);
    return new NextResponse('Not found', { status: 404 });
  }
}
