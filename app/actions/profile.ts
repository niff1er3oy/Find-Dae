'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { getUserAction } from './auth';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const UPLOAD_DIR = 'D:\\find_dae_photos\\member';
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'find-dae-my-super-secret-key-32-bytes-long');

export async function getFullProfileAction() {
  const user = await getUserAction();
  if (!user) return null;

  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name, mail, role, profile, img_1, img_2, img_3 FROM member WHERE id = ? LIMIT 1', [user.id]);
    return rows.length > 0 ? rows[0] : null;
  } catch(e) {
    console.error('Error fetching full profile:', e);
    return null;
  }
}

async function overwriteFile(oldFilename: string | null | undefined, newFile: File, prefix: string): Promise<string> {
  // หากมีไฟล์เก่าให้ลบทิ้ง (อัปโหลดทับ)
  if (oldFilename) {
    const oldPath = path.join(UPLOAD_DIR, oldFilename);
    try {
      await unlink(oldPath);
    } catch (e) {
      // Ignored if file doesn't exist
    }
  }

  const bytes = await newFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(newFile.name) || '.jpg';
  const newFilename = `${prefix}${ext}`;
  const filePath = path.join(UPLOAD_DIR, newFilename);

  await writeFile(filePath, buffer);
  return newFilename;
}

export async function updateProfilePhotosAction(formData: FormData) {
  const user = await getUserAction();
  if (!user) return { success: false, error: 'กรุณาเข้าสู่ระบบก่อน' };

  try {
    const [currentRows] = await pool.query<RowDataPacket[]>('SELECT profile, img_1, img_2, img_3 FROM member WHERE id = ?', [user.id]);
    if (currentRows.length === 0) return { success: false, error: 'ไม่พบข้อมูลผู้ใช้' };
    const curr = currentRows[0];

    const profileFile = formData.get('profile') as File | null;
    const img1File = formData.get('img_1') as File | null;
    const img2File = formData.get('img_2') as File | null;
    const img3File = formData.get('img_3') as File | null;

    let updatedProfile = curr.profile;
    let updatedImg1 = curr.img_1;
    let updatedImg2 = curr.img_2;
    let updatedImg3 = curr.img_3;

    let hasChanges = false;

    if (profileFile && profileFile.size > 0) {
      updatedProfile = await overwriteFile(curr.profile, profileFile, `${user.id}_prof`);
      hasChanges = true;
    }
    if (img1File && img1File.size > 0) {
      updatedImg1 = await overwriteFile(curr.img_1, img1File, `${user.id}_img_1`);
      hasChanges = true;
    }
    if (img2File && img2File.size > 0) {
      updatedImg2 = await overwriteFile(curr.img_2, img2File, `${user.id}_img_2`);
      hasChanges = true;
    }
    if (img3File && img3File.size > 0) {
      updatedImg3 = await overwriteFile(curr.img_3, img3File, `${user.id}_img_3`);
      hasChanges = true;
    }

    if (hasChanges) {
      await pool.query(
        'UPDATE member SET profile = ?, img_1 = ?, img_2 = ?, img_3 = ? WHERE id = ?',
        [updatedProfile, updatedImg1, updatedImg2, updatedImg3, user.id]
      );

      // ทำการอัปเดต Cookie JWT ให้มีชื่อโปรไฟล์ใหม่ (หากมีการเปลี่ยนรูปโปรไฟล์)
      if (profileFile && profileFile.size > 0) {
        const token = await new SignJWT({ id: user.id, name: user.name, role: user.role, profile: updatedProfile })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('24h')
          .sign(SECRET_KEY);
        
        const cookieStore = await cookies();
        cookieStore.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24, path: '/' });
      }

      return { success: true };
    }

    return { success: true }; // ไม่มีไฟล์ให้เปลี่ยน ถือว่าสำเร็จแบบไม่มีอะไรเกิดขึ้น
  } catch (e) {
    console.error('Update profile error:', e);
    return { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตรูปภาพ ถ่ายทอดข้อมูลไม่สำเร็จ' };
  }
}

export async function updatePasswordAction(formData: FormData) {
  const user = await getUserAction();
  if (!user) return { success: false, error: 'กรุณาเข้าสู่ระบบก่อน' };

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!currentPassword || !newPassword) {
    return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT password FROM member WHERE id = ?', [user.id]);
    if (rows.length === 0) return { success: false, error: 'User not found' };

    const valid = await bcrypt.compare(currentPassword, rows[0].password);
    if (!valid) return { success: false, error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' };

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE member SET password = ? WHERE id = ?', [hashed, user.id]);

    return { success: true };
  } catch (e) {
    console.error('Update password error:', e);
    return { success: false, error: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' };
  }
}
