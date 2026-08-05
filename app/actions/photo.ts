'use server';

import pool from '@/lib/db';
import { getUserAction } from './auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { checkEventRoleAction } from './event';
import type { RowDataPacket } from 'mysql2';
import { EVENTS_UPLOAD_DIR as UPLOAD_DIR_BASE } from '@/lib/uploadDirs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

interface PhotoRow extends RowDataPacket {
  id: number;
  image_path: string;
  photographer_id: number;
}

export async function uploadMultiplePhotosAction(eventId: string, formData: FormData) {
  const user = await getUserAction();

  // 1. ตรวจสอบสิทธิ์ (ต้องเป็นตากล้องเท่านั้น)
  if (!user || user.role !== 'photographer') {
    return { success: false, error: 'เฉพาะตากล้องเท่านั้นที่สามารถอัปโหลดรูปลงงานนี้ได้' };
  }

  const role = await checkEventRoleAction(eventId);
  if (role === 'none') {
    return { success: false, error: 'คุณยังไม่ได้ถูกเชิญให้เป็นผู้ดูแลร่วมในงานนี้ จึงไม่สามารถอัปโหลดได้' };
  }

  // 2. ดึงไฟล์ทั้งหมดออกมาจาก FormData
  const files = formData.getAll('photos') as File[];

  if (!files || files.length === 0) {
    return { success: false, error: 'ไม่พบไฟล์ที่เลือกส่งมา' };
  }

  // 3. ป้องกันการอัปโหลดที่เกินขนาดหรือเกินจำนวน (จำกัด 500 รูป)
  if (files.length > 500) {
    return { success: false, error: 'อัปโหลดได้สูงสุดครั้งละ 500 รูปเท่านั้น' };
  }

  const validFiles = files.filter(f => f.size > 0 && f.size <= MAX_FILE_SIZE);
  if (validFiles.length !== files.length) {
    return { success: false, error: 'พบรูปภาพที่มีขนาดเกิน 5MB อยู่ในรายการ กรุณาตรวจสอบแล้วลองอัปโหลดภาพที่ผ่านเกณฑ์เท่านั้น' };
  }

  try {
    // 4. เตรียมโฟลเดอร์สำหรับงานนี้
    const eventPhotosDir = path.join(UPLOAD_DIR_BASE, String(eventId));
    await mkdir(eventPhotosDir, { recursive: true });

    // 5. เตรียมคำสั่ง SQL แบบ Multiple Insert เพื่อประสิทธิภาพการทำงาน
    let sqlValues = [];
    let bindParams: any[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];

      // อ่านไฟล์
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // สร้างชื่อไฟล์แบบ Random ไม่ซ้ำกัน
      const ext = path.extname(file.name) || '.jpg';
      const filename = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
      const filePath = path.join(eventPhotosDir, filename);

      // เขียนไฟล์ลง Local Drive
      await writeFile(filePath, buffer);

      // เตรียมข้อมูลชุด Insert ลง DB
      sqlValues.push('(?, ?, ?, NOW())');
      bindParams.push(filename, eventId, user.id);
    }

    // 6. รัน SQL INSERT ข้อมูลหลายแถวรวดเดียว
    if (sqlValues.length > 0) {
      const sqlQuery = `INSERT INTO photos (image_path, event_id, photographer_id, created_at) VALUES ${sqlValues.join(', ')}`;
      await pool.query(sqlQuery, bindParams);
    }

    return {
      success: true,
      message: `อัปโหลดจำนวน ${validFiles.length} รูปเรียบร้อยแล้ว!`,
      folder_path: eventPhotosDir
    };

  } catch (e) {
    console.error('Error uploading massive photos:', e);
    return { success: false, error: 'เกิดข้อผิดพลาดในการบันทึกภาพ ถ่ายทอดข้อมูลล้มเหลว' };
  }
}

// แยก Action สำหรับยิงหา AI เพื่อให้หน้าบ้านเอาไว้ทำแอนิเมชัน "รอรีพอร์ต"
// AI ฝั่ง Python จะรับงานแล้วประมวลผลใน background ทันที ไม่รอจนเสร็จ
// ให้ฝั่ง front-end poll ความคืบหน้าต่อผ่าน getAIProgressAction แทน
export async function callAIForReportAction(eventId: string, folder_path: string) {
  try {
    const res = await fetch('http://127.0.0.1:8055/photographers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: String(eventId),
        folder_path: folder_path
      })
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      return { success: false, error: errBody?.detail || 'AI Server ปฏิเสธคำขอ' };
    }

    return { success: true };
  } catch (apiError) {
    console.error('AI Processing API call failed:', apiError);
    return { success: false, error: 'AI Server ไม่ตอบสนอง หรือยังไม่ได้เปิดระบบ' };
  }
}

// ---------------------------------------------------------------------------
// ดึงความคืบหน้าล่าสุดของการ index รูป (สำหรับ poll ระหว่างรอ AI สแกน)
// ---------------------------------------------------------------------------
export async function getAIProgressAction(eventId: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8055/photographers/${String(eventId)}/status`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      return { success: false, error: errBody?.detail || 'ไม่พบสถานะความคืบหน้า' };
    }

    const progress = await res.json();
    return { success: true, progress };
  } catch (apiError) {
    console.error('AI progress polling failed:', apiError);
    return { success: false, error: 'AI Server ไม่ตอบสนอง' };
  }
}

// ---------------------------------------------------------------------------
// ยิงเช็กสถานะว่า AI Server รันอยู่หรือไม่เพื่อป้องกันการรับฝากรูปสูญเปล่า
// ---------------------------------------------------------------------------
export async function checkAiServerAction() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    // ลองส่งคำขอเบากระจิ๋วหลิวแค่ HEAD ไปเช็กว่าสายว่างไหม
    await fetch('http://127.0.0.1:8055/', { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeoutId);

    // ถ้ารอดผ่านตัว fetch มาได้ (ไม่ว่าจะตอบ 404/405) แปลว่าเซิร์ฟเวอร์ตื่นอยู่ตอบกลับมา
    return true;
  } catch (e) {
    // ถ้าพังอย่าง ECONNREFUSED (เซิร์ฟดับ) จะตกลงมาที่นี่
    return false;
  }
}

// ---------------------------------------------------------------------------
// ดึงข้อมูลรูปภาพของอีเวนต์
// ---------------------------------------------------------------------------
export async function getEventPhotosAction(eventId: string) {
  try {
    const [photos] = await pool.query<PhotoRow[]>(
      'SELECT id, image_path, photographer_id FROM photos WHERE event_id = ? ORDER BY id DESC',
      [eventId]
    );
    return photos;
  } catch (error) {
    console.error('Error fetching event photos:', error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// ดึงข้อมูลรูปภาพที่มี "หน้า" ของเราซ่อนอยู่ (สำหรับ Attendee)
// ---------------------------------------------------------------------------
export async function getMyEventPhotosAction(eventId: string) {
  const user = await getUserAction();
  if (!user) return [];

  try {
    const [photos] = await pool.query<PhotoRow[]>(
      `SELECT p.id, p.image_path, p.photographer_id
       FROM photos p
       JOIN face f ON p.id = f.photos_id
       WHERE f.attendee_id = ? AND p.event_id = ?
       GROUP BY p.id
       ORDER BY p.id DESC`,
      [user.id, eventId]
    );
    return photos;
  } catch (error) {
    console.error('Error fetching my event photos:', error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// ยิง API สั่งให้ AI ตรวจสอบและค้นหาใบหน้า (สำหรับ Attendee)
// ตอนนี้ใช้ HTTP POST ตามที่คุณอนุญาตมาครับ
// ---------------------------------------------------------------------------
export async function callAISearchAction(eventId: string) {
  const user = await getUserAction();
  if (!user) return { success: false, error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' };

  try {
    const res = await fetch('http://127.0.0.1:8055/attendee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         event_id: String(eventId),
         member_id: String(user.id)
      })
    });
    
    // ดึงค่ารีพอร์ต (Report) กลับมาจาก AI
    const reportText = await res.text();
    return { success: true, report: reportText };
  } catch (apiError) {
    console.error('AI Searching API call failed:', apiError);
    return { success: false, error: 'AI Server ไม่ตอบสนอง หรือยังไม่ได้เปิดระบบ' };
  }
}

// ---------------------------------------------------------------------------
// ลบรูปภาพ — ออกจาก DB และไฟล์บนเครื่อง (เฉพาะตากล้อง)
// ---------------------------------------------------------------------------
export async function deletePhotoAction(photoId: number, eventId: string) {
  const user = await getUserAction();
  if (!user || user.role !== 'photographer') {
    return { success: false, error: 'เฉพาะตากล้องเท่านั้นที่สามารถลบรูปได้' };
  }

  const role = await checkEventRoleAction(eventId);
  if (role === 'none') {
    return { success: false, error: 'ไม่มีสิทธิ์เข้าถึงงานนี้' };
  }

  try {
    // 1. ดึง image_path ออกมาก่อนลบ
    let rows;
    if (role === 'main_owner' || role === 'owner') {
      // หน้าที่ owner คือสามารถลบได้ทุกรูป
      [rows] = await pool.query<import('mysql2').RowDataPacket[]>(
        'SELECT image_path FROM photos WHERE id = ? AND event_id = ?',
        [photoId, eventId]
      );
    } else {
      // photographer ธรรมดาลบได้แค่ของตัวเอง
      [rows] = await pool.query<import('mysql2').RowDataPacket[]>(
        'SELECT image_path FROM photos WHERE id = ? AND event_id = ? AND photographer_id = ?',
        [photoId, eventId, user.id]
      );
    }

    if (rows.length === 0) {
      return { success: false, error: 'ไม่พบรูปนี้ หรือไม่มีสิทธิ์ลบ' };
    }

    const imagePath = rows[0].image_path;

    // 2. ลบ child rows ใน face ก่อน (FK constraint)
    await pool.query('DELETE FROM face WHERE photos_id = ?', [photoId]);

    // 3. ลบออกจากฐานข้อมูล
    await pool.query('DELETE FROM photos WHERE id = ?', [photoId]);

    // 3. ลบไฟล์จาก disk
    const filePath = path.join(UPLOAD_DIR_BASE, String(eventId), imagePath);
    try {
      await unlink(filePath);
    } catch (fileErr) {
      // ไฟล์อาจถูกลบไปแล้ว ไม่ต้อง throw
      console.warn('File not found on disk, skipping:', filePath);
    }

    return { success: true };
  } catch (e) {
    console.error('Error deleting photo:', e);
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบรูป' };
  }
}
