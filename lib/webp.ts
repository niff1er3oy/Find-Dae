import sharp from 'sharp';
import path from 'path';

const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 82;

// คำนวณ path ของไฟล์ .webp คู่กัน — คืน null ถ้าไม่มีนามสกุลให้แทนที่
// (ไฟล์ที่แอปสร้างเองมีนามสกุลเสมอ กันไว้เผื่อ path แปลกๆ หลุดเข้ามา)
export function getWebpPath(filePath: string): string | null {
  const ext = path.extname(filePath);
  if (!ext) return null;
  if (ext.toLowerCase() === '.webp') return filePath;
  return `${filePath.slice(0, -ext.length)}.webp`;
}

// สร้างไฟล์ .webp คู่กันไว้ข้างไฟล์ต้นฉบับ สำหรับใช้แสดงผลให้โหลดเร็วขึ้น
// ไฟล์ต้นฉบับยังอยู่ครบสำหรับดาวน์โหลด — ทำแบบ best-effort ไม่ throw ถ้าแปลงพัง
export async function generateWebpVariant(originalFilePath: string): Promise<void> {
  const webpPath = getWebpPath(originalFilePath);
  if (!webpPath || webpPath === originalFilePath) return;

  try {
    await sharp(originalFilePath)
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);
  } catch (e) {
    console.error(`Failed to generate WebP variant for ${originalFilePath}:`, e);
  }
}
