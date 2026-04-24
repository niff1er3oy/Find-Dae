import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// ต้องเป็น Key 32-bytes เพื่อให้รองรับ Web Crypto API ของ Edge Middleware
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'find-dae-my-super-secret-key-32-bytes-long');

export async function proxy(request: NextRequest) {
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

  // 2. หน้า /events/create เฉพาะตากล้องเท่านั้น
  if (path.startsWith('/events/create')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (payload.role !== 'photographer') {
      return NextResponse.redirect(new URL('/events', request.url));
    }
  }

  // 3. หน้า /dashboard ต้องล็อกอินแล้วเท่านั้น (ทุก role เข้าได้)
  if (path.startsWith('/dashboard')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// กำหนดขอบเขตหน้าเว็บที่ต้องการให้ Proxy นี้ทำงาน
export const config = {
  matcher: ['/events/create/:path*', '/dashboard/:path*', '/login', '/signup'],
};
