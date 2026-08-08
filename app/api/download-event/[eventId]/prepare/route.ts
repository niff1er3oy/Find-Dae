import { NextRequest, NextResponse } from 'next/server';
import { getUserAction } from '@/app/actions/auth';
import { checkEventAccessAction } from '@/app/actions/event';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import path from 'path';
import { existsSync } from 'fs';
import { EVENTS_UPLOAD_DIR as UPLOAD_DIR_BASE } from '@/lib/uploadDirs';
import { cleanupOldZips, computeJobId, markZipUsed, startZipBuild, zipPathFor } from '@/lib/downloadJobs';

// จังหวะที่ 1 ของการดาวโหลดรวม: สั่งเซิร์ฟเวอร์เริ่มสร้าง zip เบื้องหลังแล้วตอบ jobId กลับทันที
// ไม่ผูกการสร้างไฟล์กับ connection ของ request — client ไป poll ที่ /status แล้วโหลดจาก /file
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  // eventId ถูกใช้ประกอบชื่อไฟล์ดาวโหลดด้วย — บังคับเป็นตัวเลขล้วนกัน input แปลกๆ
  if (!/^\d+$/.test(eventId)) {
    return NextResponse.json({ error: 'invalid event id' }, { status: 400 });
  }

  // ตรวจสอบสิทธิ์ — ต้องล็อกอินและมีสิทธิ์เข้าถึงงานนี้จริง (เช็กเดียวกับที่หน้า event ใช้กรองก่อน
  // render) กัน user ที่ล็อกอินอยู่แต่ไม่มีสิทธิ์ ยิง photoIds เดามาดาวโหลดรูปงานอื่นผ่าน API ตรงๆ
  const user = await getUserAction();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const hasAccess = await checkEventAccessAction(eventId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // รับรายชื่อ photo id ผ่าน POST body (ตรงกับรูปที่ gallery ฝั่งนั้นแสดงจริง เช่นเฉพาะ
  // "รูปที่คุณอยู่ในระบบ") — จำนวนอาจเป็นพัน ใส่ URL ไม่ได้เพราะชนขีดจำกัดความยาว
  let photoIds: unknown;
  try {
    ({ photoIds } = await req.json());
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 });
  }
  if (
    !Array.isArray(photoIds) ||
    photoIds.length === 0 ||
    photoIds.length > 20000 ||
    !photoIds.every(id => Number.isInteger(id))
  ) {
    return NextResponse.json({ error: 'photoIds ต้องเป็น array ของ id' }, { status: 400 });
  }

  // กรองด้วย event_id เสมอ กัน id ของงานอื่นหลุดเข้ามาผ่าน photoIds
  const [photos] = await pool.query<RowDataPacket[]>(
    'SELECT image_path FROM photos WHERE event_id = ? AND id IN (?) ORDER BY id ASC',
    [eventId, photoIds]
  );
  if (!photos.length) {
    return NextResponse.json({ error: 'ไม่มีรูปในงานนี้' }, { status: 404 });
  }

  const filePaths = (photos as any[])
    .map((p: any) => path.join(UPLOAD_DIR_BASE, String(eventId), p.image_path))
    .filter(f => existsSync(f));
  if (!filePaths.length) {
    return NextResponse.json({ error: 'ไม่พบไฟล์บน disk' }, { status: 404 });
  }

  const jobId = computeJobId(eventId, photoIds as number[]);
  const zipPath = zipPathFor(jobId);

  if (existsSync(zipPath)) {
    // มี zip ชุดเดียวกันเสร็จค้างอยู่แล้ว (เช่นผู้ใช้คนอื่นในงานเพิ่งขอไป) — ใช้ซ้ำได้เลย
    // ต้อง touch mtime ให้เสร็จก่อนค่อยสั่ง cleanup กันไฟล์เก่าใกล้หมดอายุถูกลบตัดหน้าตอนจะโหลด
    await markZipUsed(zipPath);
    void cleanupOldZips();
    return NextResponse.json({ success: true, jobId, ready: true });
  }

  void cleanupOldZips();
  startZipBuild(jobId, filePaths);
  return NextResponse.json({ success: true, jobId, ready: false });
}
