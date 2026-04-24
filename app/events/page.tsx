import Link from 'next/link';
import { getEventsAction } from '@/app/actions/event';
import { getUserAction } from '@/app/actions/auth';
import { PartyPopper, Inbox } from 'lucide-react';
import ClientEventsView from './ClientEventsView';

export default async function EventsPage() {
  const events = await getEventsAction();
  const user = await getUserAction();

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 flex flex-col pt-28 sm:pt-32 pb-12 px-4 sm:px-6">

      {/* Playful Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="bg-bubble absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] bg-accent-peach/40 rounded-full blur-3xl animate-blob text-slate-800" />
        <div className="bg-bubble absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] bg-accent-yellow/30 rounded-full blur-3xl animate-blob text-slate-800" style={{ animationDelay: '2s' }} />
        <div className="bg-bubble absolute bottom-[-5%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] bg-accent-pink/30 rounded-full blur-3xl animate-blob text-slate-800" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">

        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-16 gap-4">
          <div>
            <h1 className="text-3xl sm:text-6xl font-black text-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3 mb-3 sm:mb-4">
              เลือกอีเวนต์ของคุณ <span className="text-accent-pink animate-bounce-short"><PartyPopper className="inline w-10 h-10 sm:w-12 sm:h-12" /></span>
            </h1>
            <p className="text-base sm:text-xl text-slate-500 font-bold max-w-2xl mx-auto">
              รวมงานอีเวนต์ทั้งหมดที่รอให้คุณไปค้นหารูป!
            </p>
          </div>

        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center relative">
            <Inbox className="w-20 h-20 text-slate-300 mb-6 mx-auto animate-bounce-slow" />
            <h3 className="text-3xl font-black text-slate-700">ยังไม่มีอีเวนต์ในระบบ</h3>
            <p className="text-slate-500 mt-2 font-bold text-lg">รอให้ตากล้องมาเปิดงานแรกอยู่น้าา</p>
          </div>
        ) : (
          <ClientEventsView initialEvents={events} user={user} />
        )}

      </div>
    </div>
  );
}
