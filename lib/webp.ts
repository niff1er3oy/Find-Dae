import sharp from 'sharp';
import path from 'path';

const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 82;
const CONVERT_TIMEOUT_SECONDS = 15;

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
    // sharp มี .timeout() ในตัวที่ยกเลิก libvips ได้จริง (ใช้ได้บน Linux ซึ่งเป็น server จริง)
    // ใส่ Promise.race คลุมอีกชั้นเป็น fallback เผื่อกรณีที่ native timeout ไม่ทำงาน
    // ไม่งั้นถ้าไฟล์ไหนทำให้ sharp ค้าง จะพา uploadMultiplePhotosAction ทั้งก้อนค้างตามไปด้วย
    await Promise.race([
      sharp(originalFilePath)
        .timeout({ seconds: CONVERT_TIMEOUT_SECONDS })
        .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpPath),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('WebP conversion timed out')), (CONVERT_TIMEOUT_SECONDS + 5) * 1000)
      ),
    ]);
  } catch (e) {
    console.error(`Failed to generate WebP variant for ${originalFilePath}:`, e);
  }
}
