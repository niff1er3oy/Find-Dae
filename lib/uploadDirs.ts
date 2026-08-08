import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/home/niff1er/Documents/find_dae_photos'; // Default path if not set in .env

export const MEMBER_UPLOAD_DIR = path.join(UPLOAD_DIR, 'member');
export const EVENTS_UPLOAD_DIR = path.join(UPLOAD_DIR, 'events');

// ที่เก็บไฟล์ zip สำเร็จรูปสำหรับดาวโหลดรวมทั้งงาน — ใช้ path ข้างๆ โฟลเดอร์รูปจริงแทน os.tmpdir()
// เพราะ /tmp บนเซิร์ฟเวอร์จริงเป็น tmpfs (RAM-backed, เหลือไม่กี่ GB) แต่ UPLOAD_DIR อยู่บนดิสก์จริง
// ที่ต้องมีที่พอสำหรับรูปต้นฉบับทั้งหมดอยู่แล้ว
export const DOWNLOAD_TMP_DIR = path.join(UPLOAD_DIR, '.tmp-downloads');
