import { NextRequest, NextResponse } from 'next/server';
import { getUserAction } from '@/app/actions/auth';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import path from 'path';
import { mkdir, rm, stat, writeFile } from 'fs/promises';
import { existsSync, createReadStream, chmodSync } from 'fs';
import { Readable } from 'stream';
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

    // ส่ง path ทีละไฟล์เป็น argument ของ spawn ตรงๆ จะพังเมื่อจำนวนไฟล์เยอะ
    // (รวมความยาวเกิน command line limit ของ OS) ใช้ 7-Zip @listfile แทน
    // เพื่อให้ argument บน command line มีแค่ path เดียวไม่ว่าจะมีกี่ไฟล์ก็ตาม
    const listFilePath = path.join(tempDir, 'filelist.txt');
    // ขึ้นต้นด้วย UTF-16LE BOM เพื่อให้ 7-Zip อ่าน listfile เป็น unicode
    // (เผื่อ path มีอักขระที่ไม่ใช่ ASCII)
    await writeFile(listFilePath, '\uFEFF' + filePaths.join('\r\n'), 'utf16le');

    // สร้างไฟล์ 7z
    await new Promise<void>((resolve, reject) => {
      const stream = Seven.add(archivePath, [`@${listFilePath}`], {
        $bin: sevenBinPath,
        method: ['0=LZMA2', 'x=5'],
      });
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    // สตรีมไฟล์แทนการอ่านทั้งไฟล์เข้า Buffer — fs.readFile จำกัดขนาดไว้ที่ 2 GiB
    // ซึ่งไฟล์ .7z ของงานที่มีรูปเยอะๆ เกินได้ง่าย
    const { size } = await stat(archivePath);
    const nodeStream = createReadStream(archivePath);
    nodeStream.on('close', () => {
      rm(tempDir, { recursive: true, force: true }).catch(() => {});
    });

    return new NextResponse(Readable.toWeb(nodeStream) as ReadableStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-7z-compressed',
        'Content-Disposition': `attachment; filename="event_${eventId}_photos.7z"`,
        'Content-Length': String(size),
      },
    });
  } catch (e) {
    console.error('Error creating 7z archive:', e);
    rm(tempDir, { recursive: true, force: true }).catch(() => {});
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสร้างไฟล์ 7z' }, { status: 500 });
  }
}
