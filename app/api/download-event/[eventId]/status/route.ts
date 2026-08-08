import { NextRequest, NextResponse } from 'next/server';
import { getUserAction } from '@/app/actions/auth';
import { checkEventAccessAction } from '@/app/actions/event';
import { existsSync } from 'fs';
import { getJobState, isValidJobId, zipPathFor } from '@/lib/downloadJobs';

// จังหวะที่ 2: client poll ความคืบหน้าการสร้าง zip — ตอบจากไฟล์บนดิสก์ก่อน (รอดข้าม restart)
// แล้วค่อยดูสถานะใน memory ถ้าไม่รู้จัก job เลยตอบ unknown ให้ client สั่ง /prepare ใหม่
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  if (!/^\d+$/.test(eventId)) {
    return NextResponse.json({ error: 'invalid event id' }, { status: 400 });
  }

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

  if (existsSync(zipPathFor(jobId))) {
    return NextResponse.json({ status: 'ready' });
  }

  const state = getJobState(jobId);
  if (!state || state.status === 'ready') {
    // memory บอก ready แต่ไฟล์หาย (โดน cleanup) หรือไม่รู้จักเลย (server restart กลางคัน)
    return NextResponse.json({ status: 'unknown' });
  }
  if (state.status === 'error') {
    return NextResponse.json({ status: 'error', error: state.error });
  }
  return NextResponse.json({ status: 'building', processed: state.processed, total: state.total });
}
