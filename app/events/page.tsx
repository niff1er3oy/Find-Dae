import Link from 'next/link';
import { getEventsAction } from '@/app/actions/event';
import { getUserAction } from '@/app/actions/auth';
import { Camera, Lock, PartyPopper, Inbox } from 'lucide-react';

export default async function EventsPage() {
  const events = await getEventsAction();
  const user = await getUserAction();

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 flex flex-col pt-32 pb-12 px-6">

      {/* Playful Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="bg-bubble absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] bg-accent-peach/40 rounded-full blur-3xl animate-blob text-slate-800" />
        <div className="bg-bubble absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] bg-accent-yellow/30 rounded-full blur-3xl animate-blob text-slate-800" style={{ animationDelay: '2s' }} />
        <div className="bg-bubble absolute bottom-[-5%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] bg-accent-pink/30 rounded-full blur-3xl animate-blob text-slate-800" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">

        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center mb-16 gap-4">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              เลือกอีเวนต์ของคุณ <span className="text-accent-pink animate-bounce-short"><PartyPopper className="inline w-12 h-12" /></span>
            </h1>
            <p className="text-xl text-slate-500 font-bold max-w-2xl mx-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: any) => (
              <EventCard key={event.id} event={event} user={user} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function EventCard({ event, user }: { event: any, user: any }) {
  // หากยังไม่ล็อกอิน ให้โดนบังคับไปหน้า login
  const targetHref = user ? `/events/${event.id}` : '/login';

  return (
    <Link href={targetHref} className="bubbly-card group relative flex flex-col overflow-hidden transition-all duration-300 aspect-[1/1.414] rounded-[28px] border-4 border-white/50 bg-slate-200">
      {/* Background Image */}
      {event.poster ? (
        <img src={`/api/event-image/${event.poster}`} alt={event.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-100">ไม่มีรูปโปสเตอร์</div>
      )}

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      {/* User check overlay */}
      {!user && (
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-slate-900/40">
          <span className="font-extrabold text-white bg-accent-orange px-6 py-3 rounded-full shadow-xl animate-pop-in flex items-center gap-2">
            <Lock className="w-5 h-5" /> ล็อกอินเพื่อดูรูป
          </span>
        </div>
      )}

      {/* Photo count badge (top-right) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full border border-white/20 shadow">
        <Camera className="w-4 h-4" />
        {event.photo_count ?? 0}
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full justify-end mt-auto w-full overflow-hidden">
        <h3 className="text-2xl sm:text-3xl font-black text-white truncate w-full mb-1 group-hover:text-accent-yellow transition-colors leading-tight drop-shadow-md">{event.name}</h3>
        <p className="text-slate-200 text-sm font-medium truncate w-full leading-relaxed drop-shadow-md">{event.detail}</p>
      </div>
    </Link>
  );
}
