'use server';

import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getUserAction } from './auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = 'D:\\find_dae_photos\\events';

// ---------------------------------------------------------------------------
// 1. สร้างอีเวนต์ใหม่ (เฉพาะช่างภาพ)
// ---------------------------------------------------------------------------
export async function createEventAction(formData: FormData) {
  const user = await getUserAction();

  // ตรวจสอบสิทธิ์ว่าต้องล็อกอินและเป็นตากล้องเท่านั้น
  if (!user || user.role !== 'photographer') {
    return { success: false, error: 'เฉพาะตากล้องเท่านั้นที่สามารถสร้างอีเวนต์ได้!' };
  }

  const name = formData.get('name') as string;
  const detail = formData.get('detail') as string;
  const posterFile = formData.get('poster') as File | null;

  if (!name || !detail || !posterFile || posterFile.size === 0) {
    return { success: false, error: 'กรุณากรอกข้อมูลและอัปโหลดรูปโปสเตอร์ให้ครบถ้วน' };
  }

  try {
    // 1. Insert ข้อมูลเพื่อให้ฐานข้อมูลประทับตรา id งานให้เราก่อน (ใส่ค่าว่างให้ poster และ path รอไว้ก่อน)
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO events (name, detail, poster, path) VALUES (?, ?, ?, ?)',
      [name, detail, '', '']
    );
    const eventId = result.insertId;

    // 2. จัดการเซฟไฟล์โปสเตอร์ลงเครื่อง
    await mkdir(UPLOAD_DIR, { recursive: true });

    // สร้างโฟลเดอร์เปล่าสำหรับเตรียมรอรับรูปภาพของตากล้องในอนาคต โดยตั้งชื่อโฟลเดอร์เป็น ID ของอีเวนต์
    const eventPhotosDir = path.join(UPLOAD_DIR, eventId.toString());
    await mkdir(eventPhotosDir, { recursive: true });

    const bytes = await posterFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(posterFile.name) || '.jpg';
    const filename = `${eventId}_poster${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    await writeFile(filePath, buffer);

    // 3. Update ข้อความชื่อไฟล์โปสเตอร์และแพทโฟลเดอร์กลับเข้าไปใน Database
    await pool.query(
      'UPDATE events SET poster = ?, path = ? WHERE id = ?',
      [filename, eventId.toString(), eventId]
    );

    return { success: true, eventId };
  } catch (e) {
    console.error('Error creating event:', e);
    return { success: false, error: 'เกิดข้อผิดพลาดในการสร้างงาน โปรดลองอีกครั้ง' }
  }
}

// ---------------------------------------------------------------------------
// 2. ดึงข้อมูลอีเวนต์ทั้งหมดสำหรับหน้าหลัก
// ---------------------------------------------------------------------------
export async function getEventsAction() {
  try {
    const [events] = await pool.query<RowDataPacket[]>(`
      SELECT e.*, COUNT(p.id) AS photo_count
      FROM events e
      LEFT JOIN photos p ON p.event_id = e.id
      GROUP BY e.id
      ORDER BY e.id DESC
    `);
    return events;
  } catch (e) {
    console.error('Error fetching events:', e);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 3. ดึงข้อมูลอีเวนต์เจาะจง (สำหรับหน้าดูงาน)
// ---------------------------------------------------------------------------
export async function getEventByIdAction(id: string) {
  try {
    const [events] = await pool.query<RowDataPacket[]>('SELECT * FROM events WHERE id = ? LIMIT 1', [id]);
    return events.length > 0 ? events[0] : null;
  } catch (e) {
    console.error('Error fetching event by id:', e);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 4. ลบงานอีเวนต์ (เฉพาะตากล้อง)
// ---------------------------------------------------------------------------
export async function deleteEventAction(eventId: string) {
  const user = await getUserAction();
  if (!user || user.role !== 'photographer') {
    return { success: false, error: 'เฉพาะตากล้องเท่านั้นที่สามารถลบงานได้' };
  }

  try {
    // 1. ดึงรายชื่อไฟล์รูปทั้งหมดในงานนี้ก่อนลบ
    const [photoRows] = await pool.query<RowDataPacket[]>(
      'SELECT image_path FROM photos WHERE event_id = ?',
      [eventId]
    );

    // 2. ลบ child rows (face) → photos → event ตามลำดับ FK
    await pool.query(
      'DELETE FROM face WHERE photos_id IN (SELECT id FROM photos WHERE event_id = ?)',
      [eventId]
    );
    await pool.query('DELETE FROM photos WHERE event_id = ?', [eventId]);
    await pool.query('DELETE FROM events WHERE id = ?', [eventId]);

    // 3. ลบไฟล์รูปทั้งหมดออกจาก disk
    const { unlink, rmdir } = await import('fs/promises');
    for (const row of photoRows as any[]) {
      try {
        const filePath = path.join(UPLOAD_DIR, String(eventId), row.image_path);
        await unlink(filePath);
      } catch { /* ข้ามถ้าไฟล์ไม่มี */ }
    }
    // ลบโฟลเดอร์ของงาน (ถ้าว่างแล้ว)
    try {
      await rmdir(path.join(UPLOAD_DIR, String(eventId)));
    } catch { /* ข้าม */ }

    return { success: true };
  } catch (e) {
    console.error('Error deleting event:', e);
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบงาน' };
  }
}
