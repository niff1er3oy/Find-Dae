import { NextRequest, NextResponse } from 'next/server';
import { getUserAction } from '@/app/actions/auth';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import path from 'path';
import { mkdir, rm } from 'fs/promises';
import { existsSync, createReadStream, chmodSync } from 'fs';
import { tmpdir } from 'os';
import { EVENTS_UPLOAD_DIR as UPLOAD_DIR_BASE } from '@/lib/uploadDirs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Seven = require('node-7z');

// path7za จาก 7zip-bin ถูก mangle โดย Next.js bundler ให้ใช้ \ROOT\ แทน
// ต้อง resolve เองจาก process.cwd() แทน (ต้องเลือก binary ให้ตรงกับ platform/arch ที่รันจริง)
function getSevenBinPath(): string {
  const base = path.join(process.cwd(), 'node_modules', '7zip-bin');
  if (process.platform === 'darwin') {
    return path.join(base, 'mac', process.arch, '7za');
  } else if (process.platform === 'win32') {
    return path.join(base, 'win', process.arch, '7za.exe');
  } else {
    return path.join(base, 'linux', process.arch, '7za');
  }
}

const sevenBinPath = getSevenBinPath();

// node_modules อาจถูกคัดลอกมาจากเครื่องอื่นและไม่ได้ตั้ง executable bit ไว้
if (process.platform !== 'win32' && existsSync(sevenBinPath)) {
  try {
    chmodSync(sevenBinPath, 0o755);
  } catch {
    // ignore — จะ error ตอน spawn แทนถ้าแก้สิทธิ์ไม่ได้จริงๆ
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // ตรวจสอบสิทธิ์
  const user = await getUserAction();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ดึงรายชื่อไฟล์รูปในงานนี้
  const [photos] = await pool.query<RowDataPacket[]>(
    'SELECT image_path FROM photos WHERE event_id = ? ORDER BY id ASC',
    [eventId]
  );

  if (!photos.length) {
    return NextResponse.json({ error: 'ไม่มีรูปในงานนี้' }, { status: 404 });
  }

  // สร้าง temp dir สำหรับเก็บ output
  const tempDir = path.join(tmpdir(), `find_dae_${eventId}_${Date.now()}`);
  await mkdir(tempDir, { recursive: true });
  const archivePath = path.join(tempDir, `event_${eventId}.7z`);

  try {
    // รวมไฟล์ path ทั้งหมด
    const filePaths = (photos as any[])
      .map((p: any) => path.join(UPLOAD_DIR_BASE, String(eventId), p.image_path))
      .filter(f => existsSync(f));

    if (!filePaths.length) {
      return NextResponse.json({ error: 'ไม่พบไฟล์บน disk' }, { status: 404 });
    }

    // สร้างไฟล์ 7z
    await new Promise<void>((resolve, reject) => {
      const stream = Seven.add(archivePath, filePaths, {
        $bin: sevenBinPath,
        method: ['0=LZMA2', 'x=5'],
      });
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    // อ่านไฟล์และส่งกลับ
    const fileBuffer = await import('fs/promises').then(fs => fs.readFile(archivePath));

    // ลบ temp dir หลังส่งข้อมูล
    rm(tempDir, { recursive: true, force: true }).catch(() => {});

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-7z-compressed',
        'Content-Disposition': `attachment; filename="event_${eventId}_photos.7z"`,
        'Content-Length': String(fileBuffer.length),
      },
    });
  } catch (e) {
    console.error('Error creating 7z archive:', e);
    rm(tempDir, { recursive: true, force: true }).catch(() => {});
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสร้างไฟล์ 7z' }, { status: 500 });
  }
}
