import Link from 'next/link';
import { getEventsAction } from '@/app/actions/event';
import { getUserAction } from '@/app/actions/auth';

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
              เลือกอีเวนต์ของคุณ <span className="text-accent-pink animate-bounce-short">🎉</span>
            </h1>
            <p className="text-xl text-slate-500 font-bold max-w-2xl mx-auto">
              รวมงานอีเวนต์ทั้งหมดที่รอให้คุณไปค้นหารูป!
            </p>
          </div>

          {user?.role === 'photographer' && (
            <Link
              href="/events/create"
              className="btn-primary flex items-center justify-center gap-2 text-xl px-10 py-4 mt-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              เปิดอีเวนต์ใหม่
            </Link>
          )}
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center relative">
            <div className="text-6xl mb-6 text-center justify-center flex w-full animate-bounce-slow">📭</div>
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
    <Link href={targetHref} className="bubbly-card group flex flex-col overflow-hidden transition-all duration-300">
      <div className="relative h-56 w-full bg-slate-200 overflow-hidden rounded-t-[28px] border-b-4 border-white/50">
        {event.poster ? (
          <img src={`/api/event-image/${event.poster}`} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-100 border-b-2 border-slate-200">ไม่มีรูปโปสเตอร์</div>
        )}

        {!user && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            <span className="font-extrabold text-white bg-accent-orange px-6 py-3 rounded-full shadow-md animate-pop-in flex items-center gap-2">
              ล็อกอินเพื่อดูรูป 🔒
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1 bg-white/40">
        <h3 className="text-2xl font-black text-slate-800 line-clamp-1 mb-2 group-hover:text-accent-orange transition-colors">{event.name}</h3>
        <p className="text-slate-500 text-sm font-bold line-clamp-2 mb-4 flex-1 leading-relaxed">{event.detail}</p>

        <div className="mt-auto flex justify-end">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:bg-accent-yellow group-hover:text-amber-800 transition-all shadow-sm">
            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
