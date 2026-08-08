import { NextRequest, NextResponse } from 'next/server';
import { getUserAction } from '@/app/actions/auth';
import { checkEventAccessAction } from '@/app/actions/event';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { isValidJobId, markZipUsed, nodeStreamToWebStream, zipPathFor } from '@/lib/downloadJobs';

// จังหวะสุดท้าย: ส่งไฟล์ zip สำเร็จรูปให้ download manager ของเบราว์เซอร์จัดการเอง
// เป็นไฟล์นิ่งบนดิสก์เลยแนบ Content-Length เป๊ะๆ ได้ (เบราว์เซอร์โชว์ % กับเวลาที่เหลือ)
// และรองรับ Range request ให้ resume ต่อได้เมื่อเน็ตหลุดกลางทาง
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  if (!/^\d+$/.test(eventId)) {
    return NextResponse.json({ error: 'invalid event id' }, { status: 400 });
  }

  // เช็คสิทธิ์ทุกครั้งแม้ jobId จะเดายากอยู่แล้ว — jobId ไม่ใช่ตั๋วแทน auth
  const user = await getUserAction();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const hasAccess = await checkEventAccessAction(eventId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const jobId = req.nextUrl.searchParams.get('job') ?? '';
  if (!isValidJobId(jobId)) {
    return NextResponse.json({ error: 'invalid job id' }, { status: 400 });
  }

  const zipPath = zipPathFor(jobId);
  const fileStat = await stat(zipPath).catch(() => null);
  if (!fileStat) {
    return NextResponse.json({ error: 'ไฟล์หมดอายุหรือยังไม่ถูกสร้าง กรุณากดดาวโหลดใหม่' }, { status: 404 });
  }
  await markZipUsed(zipPath);

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="event_${eventId}_photos.zip"`,
    'Accept-Ranges': 'bytes',
    'Last-Modified': fileStat.mtime.toUTCString(),
    'Cache-Control': 'private, max-age=0',
  };

  // รองรับ single range (bytes=start-end) พอสำหรับ resume ของเบราว์เซอร์ — รูปแบบอื่น
  // (multi-range ฯลฯ) spec อนุญาตให้เมินแล้วตอบไฟล์เต็มเป็น 200 ได้
  const range = req.headers.get('range');
  if (range) {
    const m = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (m) {
      const start = Number(m[1]);
      const end = m[2] ? Math.min(Number(m[2]), fileStat.size - 1) : fileStat.size - 1;
      if (start >= fileStat.size || start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: { 'Content-Range': `bytes */${fileStat.size}` },
        });
      }
      return new NextResponse(nodeStreamToWebStream(createReadStream(zipPath, { start, end })), {
        status: 206,
        headers: {
          ...baseHeaders,
          'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
          'Content-Length': String(end - start + 1),
        },
      });
    }
  }

  return new NextResponse(nodeStreamToWebStream(createReadStream(zipPath)), {
    status: 200,
    headers: { ...baseHeaders, 'Content-Length': String(fileStat.size) },
  });
}
