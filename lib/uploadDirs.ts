import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/home/niff1er/Documents/find_dae_photos'; // Default path if not set in .env

export const MEMBER_UPLOAD_DIR = path.join(UPLOAD_DIR, 'member');
export const EVENTS_UPLOAD_DIR = path.join(UPLOAD_DIR, 'events');

// สำหรับสร้างไฟล์ .7z ชั่วคราวตอนดาวโหลดรวมทั้งงาน — ใช้ path ข้างๆ โฟลเดอร์รูปจริงแทน os.tmpdir()
// เพราะ os.tmpdir() (/tmp บนเซิร์ฟเวอร์จริง) เป็น tmpfs (RAM-backed) มีที่ว่างจำกัดแค่ไม่กี่ GB
// ส่วน UPLOAD_DIR อยู่บนดิสก์จริงที่มีที่ว่างเยอะกว่ามาก (ต้องรองรับรูปต้นฉบับทั้งหมดอยู่แล้ว)
export const DOWNLOAD_TMP_DIR = path.join(UPLOAD_DIR, '.tmp-downloads');
