import { NextRequest, NextResponse } from 'next/server';
import { getUserAction } from '@/app/actions/auth';
import { checkEventAccessAction } from '@/app/actions/event';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import path from 'path';
import { mkdir, rm, stat } from 'fs/promises';
import { existsSync, createReadStream, chmodSync } from 'fs';
import { Readable } from 'stream';
import { EVENTS_UPLOAD_DIR as UPLOAD_DIR_BASE, DOWNLOAD_TMP_DIR } from '@/lib/uploadDirs';
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // ตรวจสอบสิทธิ์ — ต้องล็อกอินและมีสิทธิ์เข้าถึงงานนี้จริง (เช็กเดียวกับที่หน้า event ใช้กรอง
  // ก่อน render ทั้งรหัสผ่านงาน / event_access / role ตากล้อง) กัน user ที่ล็อกอินอยู่แต่ไม่มี
  // สิทธิ์เข้างานนี้ ยิง photoIds เดามาดาวโหลดรูปงานอื่นตรงๆ ผ่าน API นี้ได้
  const user = await getUserAction();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const hasAccess = await checkEventAccessAction(eventId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // รับรายชื่อ photo id ที่จะดาวโหลด (ตรงกับรูปที่ gallery ฝั่งนั้นแสดงอยู่จริง เช่น
  // เฉพาะ "รูปที่คุณอยู่ในระบบ" หรือ "รูปอื่นๆ") ส่งผ่าน POST body แทน query string
  // เพราะจำนวนรูปอาจมีเป็นพัน ถ้าใส่ใน URL จะชนขีดจำกัดความยาว URL ของ browser/proxy
  let photoIds: unknown;
  try {
    ({ photoIds } = await req.json());
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 });
  }
  if (!Array.isArray(photoIds) || photoIds.length === 0 || !photoIds.every(id => Number.isInteger(id))) {
    return NextResponse.json({ error: 'photoIds ต้องเป็น array ของ id' }, { status: 400 });
  }

  // ดึงรายชื่อไฟล์รูปในงานนี้ — กรองด้วย event_id เสมอ กัน id ของงานอื่นหลุดเข้ามาผ่าน photoIds
  const [photos] = await pool.query<RowDataPacket[]>(
    'SELECT image_path FROM photos WHERE event_id = ? AND id IN (?) ORDER BY id ASC',
    [eventId, photoIds]
  );

  if (!photos.length) {
    return NextResponse.json({ error: 'ไม่มีรูปในงานนี้' }, { status: 404 });
  }

  // สร้าง temp dir สำหรับเก็บ output — ใช้ path บนดิสก์จริงข้างๆ โฟลเดอร์รูป แทน os.tmpdir()
  // เพราะ os.tmpdir() บนเซิร์ฟเวอร์จริงเป็น tmpfs (RAM-backed) มีที่ว่างจำกัดแค่ไม่กี่ GB
  // ไม่พอสำหรับ archive ของงานที่มีรูปเยอะๆ (เจอ error "System ERROR: E_FAIL" ตอนพื้นที่ไม่พอ)
  const tempDir = path.join(DOWNLOAD_TMP_DIR, `find_dae_${eventId}_${Date.now()}`);
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

    // ส่ง path ทีละไฟล์เป็น argument ของ spawn ตรงๆ จะพังเมื่อจำนวนไฟล์เยอะ (รวมความยาวเกิน
    // command line limit ของ OS) เคยลองใช้ 7-Zip @listfile แทนแล้ว แต่ชนปัญหา charset ของ
    // listfile ไม่ตรงกันระหว่าง 7-Zip บน Windows (ตอน dev) กับ p7zip บน Linux (เซิร์ฟเวอร์จริง)
    // แก้ด้วยการแบ่งไฟล์เป็นชุดย่อยแล้วเรียก Seven.add ทับไปที่ archive เดิมหลายรอบแทน —
    // แต่ละรอบมี argument น้อยพอไม่มีทางชน limit ของ OS ไม่ว่าทั้งหมดจะมีกี่พันไฟล์ก็ตาม
    // เก็บแบบ store (ไม่บีบอัด) แทน LZMA2 — รูปเป็น .jpg/.webp ที่บีบอัดมาแล้ว บีบซ้ำด้วย LZMA2
    // แทบไม่ช่วยลดขนาดเลยแต่กิน CPU มหาศาล จนสร้าง archive ของงานที่มีรูปเยอะไม่ทันภายใน
    // เวลาที่ Cloudflare รอ (เจอ 524 "origin took too long to respond" ตอนงานมี 1700 รูป)
    const CHUNK_SIZE = 200;
    for (let i = 0; i < filePaths.length; i += CHUNK_SIZE) {
      const chunk = filePaths.slice(i, i + CHUNK_SIZE);
      await new Promise<void>((resolve, reject) => {
        const stream = Seven.add(archivePath, chunk, {
          $bin: sevenBinPath,
          method: ['x=0'],
        });
        stream.on('end', resolve);
        stream.on('error', reject);
      });
    }

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
