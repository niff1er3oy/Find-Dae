import { NextRequest, NextResponse } from 'next/server';
import { uploadMultiplePhotosAction } from '@/app/actions/photo';

// Route Handler ธรรมดาแทน Server Action สำหรับอัปโหลดรูป — ใช้ fetch + AbortController
// จากฝั่ง client ได้ตรงๆ ทำให้ยกเลิก request จริงๆ ได้เมื่อ timeout แทนที่ Server Action
// ที่พอ client เลิกรอ (Promise.race) แล้วงานฝั่ง server ยังค้างทำต่อเบื้องหลังอยู่ดี
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  let formData;
  try {
    formData = await request.formData();
  } catch {
    // client ยกเลิก request กลางทาง (เช่น timeout ผ่าน AbortController) ทำให้ multipart body ขาดตอน
    return NextResponse.json({ success: false, error: 'Upload was interrupted' }, { status: 400 });
  }

  const result = await uploadMultiplePhotosAction(eventId, formData);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
