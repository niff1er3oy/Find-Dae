'use server';

import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getUserAction } from './auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { EVENTS_UPLOAD_DIR as UPLOAD_DIR } from '@/lib/uploadDirs';
import { generateWebpVariant, getWebpPath } from '@/lib/webp';

export async function checkEventRoleAction(eventId: string) {
  const user = await getUserAction();
  if (!user) return 'none';

  const [events] = await pool.query<RowDataPacket[]>('SELECT photographer_id FROM events WHERE id = ? LIMIT 1', [eventId]);
  if (events.length === 0) return 'none';

  if (events[0].photographer_id === user.id) {
    return 'main_owner';
  }

  const [collabs] = await pool.query<RowDataPacket[]>('SELECT role FROM event_collaborators WHERE event_id = ? AND photographer_id = ? LIMIT 1', [eventId, user.id]);
  if (collabs.length > 0) {
    return collabs[0].role;
  }

  return 'none';
}

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
  const passwordStr = formData.get('password') as string;
  const password = passwordStr ? parseInt(passwordStr, 10) : null;

  if (!name || !detail || !posterFile || posterFile.size === 0) {
    return { success: false, error: 'กรุณากรอกข้อมูลและอัปโหลดรูปโปสเตอร์ให้ครบถ้วน' };
  }

  if (posterFile.size > 10 * 1024 * 1024) {
    return { success: false, error: 'รูปโปสเตอร์ต้องมีขนาดไม่เกิน 10 MB' };
  }

  try {
    // 1. Insert ข้อมูลเพื่อให้ฐานข้อมูลประทับตรา id งานให้เราก่อน (ใส่ค่าว่างให้ poster และ path รอไว้ก่อน)
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO events (name, detail, poster, path, photographer_id, password, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, detail, '', '', user.id, password]
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
    await generateWebpVariant(filePath);

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
    const [events] = await pool.query<RowDataPacket[]>(`
      SELECT e.*, m.name as creator_name, m.profile as creator_profile 
      FROM events e 
      LEFT JOIN member m ON e.photographer_id = m.id 
      WHERE e.id = ? 
      LIMIT 1
    `, [id]);
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

  const role = await checkEventRoleAction(eventId);
  if (role !== 'main_owner' && role !== 'owner') {
    return { success: false, error: 'เฉพาะเจ้าของงานเท่านั้นที่สามารถลบงานได้' };
  }

  try {
    // 1. ดึงรายชื่อไฟล์รูปทั้งหมดในงานนี้ก่อนลบ (รวมโปสเตอร์)
    const [photoRows] = await pool.query<RowDataPacket[]>(
      'SELECT image_path FROM photos WHERE event_id = ?',
      [eventId]
    );
    const [posterRows] = await pool.query<RowDataPacket[]>(
      'SELECT poster FROM events WHERE id = ?',
      [eventId]
    );
    const posterFilename = posterRows[0]?.poster as string | undefined;

    // 2. ลบ child rows (face, event_access) → photos → event ตามลำดับ FK
    await pool.query('DELETE FROM event_collaborators WHERE event_id = ?', [eventId]);
    await pool.query('DELETE FROM event_access WHERE event_id = ?', [eventId]);
    await pool.query(
      'DELETE FROM face WHERE photos_id IN (SELECT id FROM photos WHERE event_id = ?)',
      [eventId]
    );
    await pool.query('DELETE FROM photos WHERE event_id = ?', [eventId]);
    await pool.query('DELETE FROM events WHERE id = ?', [eventId]);

    // 3. ลบไฟล์รูปทั้งหมดออกจาก disk (ทั้งต้นฉบับและ .webp คู่กัน — ไม่งั้น .webp ที่เหลือค้างจะทำให้ rmdir ด้านล่างล้มเหลว)
    const { unlink, rmdir } = await import('fs/promises');
    for (const row of photoRows as any[]) {
      const filePath = path.join(UPLOAD_DIR, String(eventId), row.image_path);
      try {
        await unlink(filePath);
      } catch { /* ข้ามถ้าไฟล์ไม่มี */ }
      const webpPath = getWebpPath(filePath);
      if (webpPath && webpPath !== filePath) {
        try {
          await unlink(webpPath);
        } catch { /* ข้ามถ้าไฟล์ไม่มี */ }
      }
    }
    // ลบโฟลเดอร์ของงาน (ถ้าว่างแล้ว)
    try {
      await rmdir(path.join(UPLOAD_DIR, String(eventId)));
    } catch { /* ข้าม */ }

    // ลบไฟล์โปสเตอร์ (ทั้งต้นฉบับและ .webp คู่กัน)
    if (posterFilename) {
      const posterFilePath = path.join(UPLOAD_DIR, posterFilename);
      try {
        await unlink(posterFilePath);
      } catch { /* ไฟล์อาจไม่มีอยู่จริง */ }
      const posterWebpPath = getWebpPath(posterFilePath);
      if (posterWebpPath && posterWebpPath !== posterFilePath) {
        try {
          await unlink(posterWebpPath);
        } catch { /* ไม่มี .webp คู่กันอยู่ก็ไม่เป็นไร */ }
      }
    }

    return { success: true };
  } catch (e) {
    console.error('Error deleting event:', e);
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบงาน' };
  }
}

// ---------------------------------------------------------------------------
// 5. ตรวจสอบสิทธิ์การเข้าถึงและตรวจสอบรหัสผ่าน
// ---------------------------------------------------------------------------
export async function checkEventAccessAction(eventId: string) {
  const user = await getUserAction();
  if (!user) return false;

  const [events] = await pool.query<RowDataPacket[]>('SELECT photographer_id, password FROM events WHERE id = ? LIMIT 1', [eventId]);
  if (events.length === 0) return false;
  
  const event = events[0];
  
  // ไม่มีรหัสผ่าน หรือค่าว่าง แสดงว่าเข้าได้เลย
  if (event.password === null || event.password === undefined || String(event.password).trim() === '') {
    return true;
  }

  // เป็นเจ้าของงาน หรือผู้ดูแลร่วม (ตากล้อง) แสดงว่าเข้าได้เลย
  if (user.role === 'photographer') {
    const role = await checkEventRoleAction(eventId);
    if (role !== 'none') return true;
  }

  // เช็กตาราง event_access ว่าเคยกรอกรหัสผ่านถูกไปแล้วหรือยัง
  const [accessRecords] = await pool.query<RowDataPacket[]>('SELECT id FROM event_access WHERE event_id = ? AND attendee_id = ? LIMIT 1', [eventId, user.id]);
  if (accessRecords.length > 0) {
    return true;
  }

  return false;
}

export async function verifyEventPasswordAction(eventId: string, passwordAttempt: string) {
  const user = await getUserAction();
  if (!user) return { success: false, error: 'ต้องล็อกอินก่อนเข้าถึง' };

  try {
    const [events] = await pool.query<RowDataPacket[]>('SELECT password FROM events WHERE id = ? LIMIT 1', [eventId]);
    if (events.length === 0) return { success: false, error: 'ไม่พบงานอีเวนต์นี้' };
    
    const event = events[0];
    
    // หากลืมใส่หรือไม่กรอก ให้ส่ง error กลับ
    if (!passwordAttempt || passwordAttempt.trim() === '') {
       return { success: false, error: 'กรุณากรอกรหัสผ่าน' };
    }

    if (String(event.password) === passwordAttempt.trim()) {
      // ถ้ารหัสถูกต้อง บันทึกเก็บลายนิ้วมือลงฐานข้อมูลว่ามีสิทธิ์เรียบร้อย
      // ต้องเช็กก่อนว่ามีแล้วหรือเปล่ากันเหนียว
      const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM event_access WHERE event_id = ? AND attendee_id = ? LIMIT 1', [eventId, user.id]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO event_access (event_id, attendee_id, created_at) VALUES (?, ?, NOW())', [eventId, user.id]);
      }
      return { success: true };
    } else {
      return { success: false, error: 'รหัสผ่านไม่ถูกต้อง ลองใหม่อีกครั้ง' };
    }
  } catch (e) {
    console.error('Verify Event Password Error:', e);
    return { success: false, error: 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน' };
  }
}

// ---------------------------------------------------------------------------
// 6. ระบบการจัดการอีเวนต์สำหรับตากล้อง (Manage Events)
// ---------------------------------------------------------------------------

export async function getMyManagedEventsAction() {
  const user = await getUserAction();
  if (!user || user.role !== 'photographer') return [];

  try {
    const [events] = await pool.query<RowDataPacket[]>(`
      SELECT e.*, COUNT(p.id) as photo_count
      FROM events e
      LEFT JOIN photos p ON e.id = p.event_id
      WHERE e.photographer_id = ? OR e.id IN (SELECT event_id FROM event_collaborators WHERE photographer_id = ? AND role = 'owner')
      GROUP BY e.id
      ORDER BY e.id DESC
    `, [user.id, user.id]);
    return events;
  } catch(e) {
    console.error('Error fetching managed events:', e);
    return [];
  }
}

export async function getEventFoundAttendeesAction(eventId: string) {
  const user = await getUserAction();
  if (!user || user.role !== 'photographer') return [];

  try {
    const [attendees] = await pool.query<RowDataPacket[]>(`
      SELECT m.id, m.name, m.profile, 
             COUNT(DISTINCT f.photos_id) as matched_faces,
             GROUP_CONCAT(DISTINCT p.image_path ORDER BY p.id DESC SEPARATOR ',') as matched_photos
      FROM face f
      JOIN photos p ON f.photos_id = p.id
      JOIN member m ON f.attendee_id = m.id
      WHERE p.event_id = ?
      GROUP BY m.id
      ORDER BY matched_faces DESC
    `, [eventId]);
    return attendees.map(a => ({
      ...a,
      matched_photos: a.matched_photos ? a.matched_photos.split(',') : []
    }));
  } catch(e) {
    console.error('Error fetching event attendees:', e);
    return [];
  }
}

export async function updateEventAction(eventId: string, formData: FormData) {
  const user = await getUserAction();
  if (!user || user.role !== 'photographer') {
    return { success: false, error: 'สิทธิ์ไม่เพียงพอ' };
  }

  const role = await checkEventRoleAction(eventId);
  if (role !== 'main_owner' && role !== 'owner') {
    return { success: false, error: 'เฉพาะเจ้าของงานเท่านั้นที่สามารถแก้ไขข้อมูลได้' };
  }

  const name = formData.get('name') as string;
  const detail = formData.get('detail') as string;
  const posterFile = formData.get('poster') as File | null;
  const passwordStr = formData.get('password') as string;
  const password = passwordStr ? parseInt(passwordStr, 10) : null;

  if (!name || !detail) {
    return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
  }

  try {
    // 1. Verify ownership (Already done via role, just get current poster)
    const [events] = await pool.query<RowDataPacket[]>('SELECT id, poster FROM events WHERE id = ? LIMIT 1', [eventId]);
    if (events.length === 0) return { success: false, error: 'ไม่เจออีเวนต์นี้' };

    let filename = events[0].poster;

    // 2. Handle new poster upload if provided
    if (posterFile && posterFile.size > 0) {
      if (posterFile.size > 10 * 1024 * 1024) {
        return { success: false, error: 'รูปโปสเตอร์ต้องมีขนาดไม่เกิน 10 MB' };
      }
      
      const { unlink } = await import('fs/promises');
      const oldFilePath = path.join(UPLOAD_DIR, filename);
      try {
        await unlink(oldFilePath); // ลบรูปเก่า
      } catch { /* รูปเก่าอาจจะไม่มีอยู่จริง */ }
      const oldWebpPath = getWebpPath(oldFilePath);
      if (oldWebpPath && oldWebpPath !== oldFilePath) {
        try {
          await unlink(oldWebpPath); // ลบ .webp คู่กันของรูปเก่า
        } catch { /* ไม่มี .webp คู่กันอยู่ก็ไม่เป็นไร */ }
      }

      const bytes = await posterFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(posterFile.name) || '.jpg';
      filename = `${eventId}_poster${ext}`;
      const newFilePath = path.join(UPLOAD_DIR, filename);
      await writeFile(newFilePath, buffer);
      await generateWebpVariant(newFilePath);
    }

    // 3. Update database
    await pool.query(
      'UPDATE events SET name = ?, detail = ?, password = ?, poster = ? WHERE id = ?',
      [name, detail, password, filename, eventId]
    );

    return { success: true };
  } catch (e) {
    console.error('Error updating event:', e);
    return { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตงาน' };
  }
}

// ---------------------------------------------------------------------------
// 7. ระบบการจัดการผู้ดูแลร่วม (Event Collaborators)
// ---------------------------------------------------------------------------

interface CollaboratorRow extends RowDataPacket {
  id: number;
  role: string;
  member_id: number;
  name: string;
  mail: string;
  profile: string | null;
}

export async function getEventCollaboratorsAction(eventId: string) {
  try {
    const [collabs] = await pool.query<CollaboratorRow[]>(`
      SELECT ec.id, ec.role, m.id as member_id, m.name, m.mail, m.profile
      FROM event_collaborators ec
      JOIN member m ON ec.photographer_id = m.id
      WHERE ec.event_id = ?
      ORDER BY ec.joined_at DESC
    `, [eventId]);
    return collabs;
  } catch(e) {
    console.error('Error fetching event collaborators:', e);
    return [];
  }
}

export async function addEventCollaboratorAction(eventId: string, email: string, role: string) {
  const user = await getUserAction();
  if (!user || user.role !== 'photographer') return { success: false, error: 'สิทธิ์ไม่เพียงพอ' };

  if (role !== 'owner' && role !== 'photographer') {
    return { success: false, error: 'สถานะไม่ถูกต้อง' };
  }

  const userRole = await checkEventRoleAction(eventId);
  if (userRole !== 'main_owner' && userRole !== 'owner') {
    return { success: false, error: 'เฉพาะเจ้าของงานเท่านั้นที่สามารถเพิ่มผู้ดูแลร่วมได้' };
  }

  try {
    const [members] = await pool.query<RowDataPacket[]>('SELECT id, role, name, profile FROM member WHERE mail = ? LIMIT 1', [email]);
    if (members.length === 0) return { success: false, error: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ' };
    
    const targetMember = members[0];
    if (targetMember.role !== 'photographer') {
      return { success: false, error: 'ผู้ใช้คนนี้ไม่ได้เป็นตากล้อง ไม่สามารถเชิญเข้ามาร่วมจัดอีเวนต์ได้' };
    }

    if (targetMember.id === user.id) {
       return { success: false, error: 'ไม่สามารถเพิ่มตัวเองซ้ำได้' };
    }

    // Check if they are main_owner
    const [events] = await pool.query<RowDataPacket[]>('SELECT photographer_id FROM events WHERE id = ?', [eventId]);
    if (events[0].photographer_id === targetMember.id) {
      return { success: false, error: 'ผู้ใช้คนนี้เป็นหัวหน้าเจ้าของงานอยู่แล้ว' };
    }

    try {
      await pool.query(
        'INSERT INTO event_collaborators (event_id, photographer_id, role, joined_at) VALUES (?, ?, ?, NOW())',
        [eventId, targetMember.id, role]
      );
      return { 
         success: true, 
         collaborator: { id: targetMember.id, role: role, name: targetMember.name, mail: email, profile: targetMember.profile, member_id: targetMember.id } 
      };
    } catch(err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        return { success: false, error: 'ผู้ใช้งานคนนี้เป็นผู้ดูแลร่วมในงานนี้อยู่แล้ว' };
      }
      throw err;
    }
  } catch(e) {
    console.error('Error adding collaborator:', e);
    return { success: false, error: 'เกิดข้อผิดพลาดในการเพิ่มผู้ดูแลร่วม' };
  }
}

export async function removeEventCollaboratorAction(eventId: string, memberIdToRemove: string) {
  const user = await getUserAction();
  if (!user || user.role !== 'photographer') return { success: false, error: 'สิทธิ์ไม่เพียงพอ' };

  const userRole = await checkEventRoleAction(eventId);
  if (userRole !== 'main_owner' && userRole !== 'owner') {
    return { success: false, error: 'เฉพาะเจ้าของงานเท่านั้นที่สามารถลบผู้ดูแลร่วมได้' };
  }

  try {
    await pool.query('DELETE FROM event_collaborators WHERE event_id = ? AND photographer_id = ?', [eventId, memberIdToRemove]);
    return { success: true };
  } catch(e) {
    console.error('Error removing collaborator:', e);
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบผู้ดูแลร่วม' };
  }
}

// ---------------------------------------------------------------------------
// 8. ดึงสถิติรูปภาพในงานอีเวนต์
// ---------------------------------------------------------------------------
export async function getEventStatsAction(eventId: string) {
  try {
    const [[photoRow]] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total_photos FROM photos WHERE event_id = ?',
      [eventId]
    );
    const [[faceRow]] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total_faces FROM face WHERE photos_id IN (SELECT id FROM photos WHERE event_id = ?)',
      [eventId]
    );
    const [[matchedRow]] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as matched_faces FROM face WHERE attendee_id IS NOT NULL AND photos_id IN (SELECT id FROM photos WHERE event_id = ?)',
      [eventId]
    );
    return {
      total_photos: Number(photoRow.total_photos),
      total_faces: Number(faceRow.total_faces),
      matched_faces: Number(matchedRow.matched_faces),
    };
  } catch(e) {
    console.error('Error fetching event stats:', e);
    return { total_photos: 0, total_faces: 0, matched_faces: 0 };
  }
}

