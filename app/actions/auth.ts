'use server';

import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'find-dae-my-super-secret-key-32-bytes-long');

const UPLOAD_DIR = 'D:\\find_dae_photos\\member';

// Helper to save uploaded file
async function saveUserFile(file: File | null, filenamePrefix: string): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure the folder exists on D: drive
  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(file.name) || '.jpg';
  const filename = `${filenamePrefix}${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  await writeFile(filePath, buffer);
  return filename;
}

export async function registerAction(formData: FormData) {
  try {
    const role = formData.get('role') as string;
    const name = formData.get('name') as string;
    const mail = formData.get('mail') as string;
    const password = formData.get('password') as string;

    // Validate required fields
    if (!name || !mail || !password) {
      return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }

    // Validate images upfront before touching Database
    const img1 = formData.get('img_1') as File | null;
    const img2 = formData.get('img_2') as File | null;
    const img3 = formData.get('img_3') as File | null;

    if (role === 'attendee') {
      if (!img1 || img1.size === 0 || !img2 || img2.size === 0 || !img3 || img3.size === 0) {
        return { success: false, error: 'กรุณาอัปโหลดรูปใบหน้าให้ครบทั้ง 3 รูปเพื่อเตรียมหางานของคุณ!' };
      }
    }

    // Check if email already exists
    const [existingUsers] = await pool.query<RowDataPacket[]>('SELECT id FROM member WHERE mail = ?', [mail]);
    if (existingUsers.length > 0) {
      return { success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // STEP 1: Insert core data to get auto-incremented `id`
    // We pass empty strings for image columns to satisfy 'NOT NULL' DB constraints without a default value
    const [insertResult] = await pool.query<ResultSetHeader>(
      `INSERT INTO member (name, mail, password, role, profile, img_1, img_2, img_3) VALUES (?, ?, ?, ?, '', '', '', '')`,
      [name, mail, hashedPassword, role]
    );

    const userId = insertResult.insertId;

    // STEP 2: Save files using the correct `id` format
    const profileFile = formData.get('profile') as File | null;
    let profilePath = await saveUserFile(profileFile, `${userId}_prof`);
    if (!profilePath) {
      profilePath = '/default-profile.png';
    }

    let img1Path: string | null = null;
    let img2Path: string | null = null;
    let img3Path: string | null = null;

    if (role === 'attendee') {
      img1Path = await saveUserFile(img1, `${userId}_img_1`);
      img2Path = await saveUserFile(img2, `${userId}_img_2`);
      img3Path = await saveUserFile(img3, `${userId}_img_3`);
    }

    // STEP 3: Update records with the new file names
    await pool.query(
      `UPDATE member SET profile = ?, img_1 = ?, img_2 = ?, img_3 = ? WHERE id = ?`,
      [profilePath, img1Path, img2Path, img3Path, userId]
    );

    return { success: true };
  } catch (err: any) {
    console.error('Registration error:', err);
    return { success: false, error: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง' };
  }
}

export async function loginAction(formData: FormData) {
  try {
    const mail = formData.get('mail') as string;
    const password = formData.get('password') as string;

    if (!mail || !password) {
      return { success: false, error: 'กรุณากรอกอีเมลและรหัสผ่าน' };
    }

    const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM member WHERE mail = ? LIMIT 1', [mail]);

    if (users.length === 0) {
      return { success: false, error: 'อีเมล หรือ รหัสผ่านไม่ถูกต้อง' };
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: 'อีเมล หรือ รหัสผ่านไม่ถูกต้อง' };
    }

    // Create JWT Token
    const token = await new SignJWT({
      id: user.id,
      mail: user.mail,
      name: user.name,
      role: user.role,
      profile: user.profile
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return { success: true, role: user.role };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}

export async function getUserAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { id: number, mail: string, name: string, role: string, profile: string };
  } catch (err) {
    // กำจัด token ที่หมดอายุหรือไม่ถูกต้องทิ้ง
    cookieStore.delete('token');
    return null;
  }
}
