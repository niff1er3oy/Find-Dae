import { getPhotographerStatsAction, getContributedEventsAction } from "@/app/actions/dashboard";
import { getUserAction } from "@/app/actions/auth";
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getUserAction();
  if (!user || user.role !== 'photographer') {
    redirect('/events');
  }

  const stats = await getPhotographerStatsAction();
  const events = await getContributedEventsAction();

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
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 pb-8 border-b-4 border-white">
          <div className="flex items-center gap-6">
            <img src={user.profile.startsWith('/') ? user.profile : `/api/image/${user.profile}`} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md animate-float-soft" />
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-2">
                สวัสดี, {user.name} 👋
              </h1>
              <span className="bg-accent-orange text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-sm inline-block">📸 ตากล้องมือฉมัง</span>
            </div>
          </div>
          <Link href="/events/create" className="btn-primary flex items-center gap-2 text-xl px-10 py-5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            เปิดงานอีเวนต์ใหม่
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
           <div className="bubbly-card p-8 flex items-center gap-6 border-l-[8px] border-l-accent-pink">
              <div className="w-20 h-20 bg-pink-100 text-accent-pink rounded-full flex items-center justify-center text-4xl shadow-inner">
                🖼️
              </div>
              <div>
                <p className="text-slate-500 font-bold text-lg mb-1">ภาพผลงานทั้งหมดที่ฝากไว้</p>
                <div className="text-5xl font-black text-slate-800">{stats.totalPhotos.toLocaleString()} <span className="text-2xl text-slate-400">ภาพ</span></div>
              </div>
           </div>
           
           <div className="bubbly-card p-8 flex items-center gap-6 border-l-[8px] border-l-accent-yellow">
              <div className="w-20 h-20 bg-yellow-100 text-amber-500 rounded-full flex items-center justify-center text-4xl shadow-inner animate-pulse">
                🎪
              </div>
              <div>
                <p className="text-slate-500 font-bold text-lg mb-1">จำนวนงานอีเวนต์ที่เคยแจม</p>
                <div className="text-5xl font-black text-slate-800">{stats.totalEvents.toLocaleString()} <span className="text-2xl text-slate-400">งาน</span></div>
              </div>
           </div>
        </div>

        {/* My Contributed Events */}
        <div className="mb-6 flex items-center justify-between">
           <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
             ผลงานในแต่ละงาน <span className="text-accent-orange">📌</span>
           </h2>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-24 bubbly-card border-dashed">
            <div className="text-6xl mb-6 text-center justify-center flex w-full animate-bounce-slow">🥺</div>
            <h3 className="text-3xl font-black text-slate-700">คุณยังไม่เคยอัปโหลดรูปลงงานไหนเลย</h3>
            <p className="text-slate-500 mt-2 font-bold text-lg mb-8">ลองไปสำรวจงานที่มีอยู่ หรือเปิดงานใหม่ดูสิ!</p>
            <Link href="/events" className="btn-secondary text-lg">
               ค้นหางานอีเวนต์ทั้งหมด
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {events.map((event: any) => (
                <Link key={event.id} href={`/events/${event.id}`} className="bubbly-card group flex flex-col overflow-hidden transition-all duration-300 border-t-0 border-r-0 border-l-0 border-b-[8px] border-b-white hover:border-b-accent-peach">
                  <div className="relative h-48 w-full bg-slate-200 overflow-hidden rounded-t-[28px]">
                     {event.poster ? (
                       <img src={`/api/event-image/${event.poster}`} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-100 border-b-2 border-slate-200">ไม่มีรูปโปสเตอร์</div>
                     )}
                     
                     {/* Badge โชว์จำนวนรูปตัวเอง */}
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-black text-accent-orange shadow-lg flex items-center gap-2 transform group-hover:scale-110 transition-transform">
                        <span>📸 {event.my_photo_count} รูป</span>
                     </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 bg-white/40">
                    <h3 className="text-2xl font-black text-slate-800 line-clamp-1 mb-2 group-hover:text-accent-orange transition-colors">{event.name}</h3>
                    <p className="text-slate-500 text-sm font-bold line-clamp-2 leading-relaxed">{event.detail}</p>
                  </div>
                </Link>
             ))}
          </div>
        )}

      </div>
    </div>
  );
}
