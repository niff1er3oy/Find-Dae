import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// ต้องเป็น Key 32-bytes เพื่อให้รองรับ Web Crypto API ของ Edge Middleware
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'find-dae-my-super-secret-key-32-bytes-long');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  let payload = null;

  if (token) {
    try {
      const { payload: jwtPayload } = await jwtVerify(token, SECRET_KEY);
      payload = jwtPayload;
    } catch (e) {
      // หาก Token ไม่ถูกต้องหรือหมดอายุ
      payload = null;
    }
  }

  const path = request.nextUrl.pathname;

  // 1. หากเข้าหน้า /login หรือ /signup แล้วพบว่าล็อกอินอยู่แล้ว ให้เด้งไปหน้า Events ทันที
  if (path === '/login' || path === '/signup') {
    if (payload) {
      return NextResponse.redirect(new URL('/events', request.url));
    }
  }

  // 2. หากเข้าหน้า /events/create หรือ /dashboard ให้เช็กสิทธิ์ตากล้องอย่างเข้มงวด!
  if (path.startsWith('/events/create') || path.startsWith('/dashboard')) {
    // 2.1 ยังไม่ได้ล็อกอิน ➡️ ไล่ไปหน้าล็อกอิน
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // 2.2 ไม่ใช่ช่างภาพ ➡️ ไล่กลับไปหน้ารวม Events
    if (payload.role !== 'photographer') {
      return NextResponse.redirect(new URL('/events', request.url));
    }
  }

  return NextResponse.next();
}

// กำหนดขอบเขตหน้าเว็บที่ต้องการให้ Middleware นี้ทำงาน
export const config = {
  matcher: ['/events/create/:path*', '/dashboard/:path*', '/login', '/signup'],
};
