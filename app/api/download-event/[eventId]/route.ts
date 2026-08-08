import { NextRequest, NextResponse } from 'next/server';
import { getUserAction } from '@/app/actions/auth';
import { checkEventAccessAction } from '@/app/actions/event';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import path from 'path';
import { existsSync } from 'fs';
import { Readable } from 'stream';
import { ZipArchive } from 'archiver';
import { EVENTS_UPLOAD_DIR as UPLOAD_DIR_BASE } from '@/lib/uploadDirs';

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

  const filePaths = (photos as any[])
    .map((p: any) => path.join(UPLOAD_DIR_BASE, String(eventId), p.image_path))
    .filter(f => existsSync(f));

  if (!filePaths.length) {
    return NextResponse.json({ error: 'ไม่พบไฟล์บน disk' }, { status: 404 });
  }

  // stream ไฟล์ zip ตรงเข้า response ทีละไฟล์ ไม่สร้าง archive เต็มไฟล์บนดิสก์ก่อนแบบที่เคยทำ
  // ด้วย 7-Zip subprocess — วิธีนั้นเจอปัญหามาหมดทั้ง command line length limit, listfile charset
  // ไม่ตรงกันข้าม OS, พื้นที่ tmpfs ไม่พอ, และที่สำคัญคือ Cloudflare 524 เพราะต้องรอสร้าง archive
  // เสร็จทั้งก้อนก่อนถึงจะเริ่มส่ง byte แรกได้ วิธีนี้เริ่ม stream ได้แทบจะทันที ไม่ต้องรอทั้งก้อน
  // ใช้ store mode (ไม่บีบอัด) เพราะรูปเป็น .jpg/.webp ที่บีบอัดมาแล้ว บีบซ้ำแทบไม่ช่วยลดขนาด
  const archive = new ZipArchive({ store: true });
  archive.on('warning', (err) => console.error('Archive warning:', err));
  archive.on('error', (err) => console.error('Archive error:', err));

  for (const filePath of filePaths) {
    archive.file(filePath, { name: path.basename(filePath) });
  }
  archive.finalize().catch((err: unknown) => console.error('Archive finalize error:', err));

  return new NextResponse(Readable.toWeb(archive) as ReadableStream, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="event_${eventId}_photos.zip"`,
    },
  });
}
