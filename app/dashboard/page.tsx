import { getPhotographerStatsAction, getContributedEventsAction, getAttendeeStatsAction, getAttendeeEventsAction } from "@/app/actions/dashboard";
import { getUserAction } from "@/app/actions/auth";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Camera, Tent, Pin, Frown, Plus, Settings, Images, Search, CalendarCheck } from 'lucide-react';
import DashboardAnimations from './DashboardAnimations';


export default async function DashboardPage() {
  const user = await getUserAction();
  if (!user) redirect('/login');

  const isPhotographer = user.role === 'photographer';

  const photographerStats = isPhotographer ? await getPhotographerStatsAction() : null;
  const photographerEvents = isPhotographer ? await getContributedEventsAction() : [];
  const attendeeStats = !isPhotographer ? await getAttendeeStatsAction() : null;
  const attendeeEvents = !isPhotographer ? await getAttendeeEventsAction() : [];

  const events = isPhotographer ? photographerEvents : attendeeEvents;

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 flex flex-col pt-32 pb-16 px-6">

      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="bg-bubble absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] bg-accent-peach/40 rounded-full blur-3xl" />
        <div className="bg-bubble absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] bg-accent-yellow/30 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="bg-bubble absolute bottom-[-5%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] bg-accent-pink/30 rounded-full blur-3xl" style={{ animationDelay: '4s' }} />
      </div>

      <DashboardAnimations />


      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col gap-12">

        {/* ── Hero Header ── */}
        <div className="bubbly-card p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 border-b-[6px] border-b-white relative overflow-hidden">
          {/* Decorative Circle */}
          <div className={`absolute -right-16 -top-16 w-56 h-56 rounded-full opacity-20 ${isPhotographer ? 'bg-accent-orange' : 'bg-accent-pink'}`} />

          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={user.profile ? (user.profile.startsWith('/') ? user.profile : `/api/image/${user.profile}`) : '/api/image/default-profile.png'}
              alt="Profile"
              className="hero-avatar w-28 h-28 rounded-full object-cover border-[6px] border-white shadow-xl"
            />
            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md ${isPhotographer ? 'bg-accent-orange' : 'bg-accent-pink'}`}>
              {isPhotographer ? <Camera className="w-5 h-5 text-white" /> : <Search className="w-5 h-5 text-white" />}
            </div>
          </div>

          {/* Name & Role */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-slate-400 font-bold text-base mb-1">{isPhotographer ? 'ตากล้องมือฉมัง' : 'นักผจญภัยในอีเวนต์'}</p>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-3 leading-tight">
              {user.name}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/settings" className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 bg-white text-slate-600 font-bold hover:border-accent-pink hover:text-accent-pink transition-all text-sm shadow-sm">
              <Settings className="w-4 h-4" /> ตั้งค่า
            </Link>
            {isPhotographer && (
              <Link href="/events/create" className="btn-primary flex items-center justify-center gap-2 px-8 py-3 text-base">
                <Plus className="w-5 h-5" /> เปิดงานใหม่
              </Link>
            )}
            {!isPhotographer && (
              <Link href="/events" className="btn-primary flex items-center justify-center gap-2 px-8 py-3 text-base" style={{ background: 'linear-gradient(135deg,#ff6eb4,#ff9de2)', boxShadow: '0 6px 0 #c2195b' }}>
                <Search className="w-5 h-5" /> ไปค้นหารูป
              </Link>
            )}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-4">
          {isPhotographer ? (
            <>
              <div className="stagger-item bubbly-card flex items-center gap-4 p-6 border-l-[6px] border-l-accent-pink">
                <div className="w-12 h-12 bg-pink-100 text-accent-pink rounded-2xl flex items-center justify-center shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-sm mb-0.5">รูปทั้งหมด</p>
                  <p className="text-3xl font-black text-slate-800 leading-none">{(photographerStats?.totalPhotos ?? 0).toLocaleString()} <span className="text-base text-slate-400 font-bold">ภาพ</span></p>
                </div>
              </div>
              <div className="stagger-item bubbly-card flex items-center gap-4 p-6 border-l-[6px] border-l-accent-yellow">
                <div className="w-12 h-12 bg-yellow-100 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Tent className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-sm mb-0.5">งานที่แจม</p>
                  <p className="text-3xl font-black text-slate-800 leading-none">{(photographerStats?.totalEvents ?? 0).toLocaleString()} <span className="text-base text-slate-400 font-bold">งาน</span></p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="stagger-item bubbly-card flex items-center gap-4 p-6 border-l-[6px] border-l-accent-pink">
                <div className="w-12 h-12 bg-pink-100 text-accent-pink rounded-2xl flex items-center justify-center shrink-0">
                  <Images className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-sm mb-0.5">รูปที่เจอ</p>
                  <p className="text-3xl font-black text-slate-800 leading-none">{(attendeeStats?.totalPhotosFound ?? 0).toLocaleString()} <span className="text-base text-slate-400 font-bold">ภาพ</span></p>
                </div>
              </div>
              <div className="stagger-item bubbly-card flex items-center gap-4 p-6 border-l-[6px] border-l-accent-yellow">
                <div className="w-12 h-12 bg-yellow-100 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-sm mb-0.5">งานที่ค้นหา</p>
                  <p className="text-3xl font-black text-slate-800 leading-none">{(attendeeStats?.totalEventsSearched ?? 0).toLocaleString()} <span className="text-base text-slate-400 font-bold">งาน</span></p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Event Cards ── */}
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-8">
            {isPhotographer ? 'งานที่ฉันมีส่วนร่วม' : 'งานที่ฉันเคยค้นหา'}
            <Pin className="w-6 h-6 text-accent-orange" />
          </h2>

          {events.length === 0 ? (
            <div className="text-center py-20 bubbly-card flex flex-col items-center">
              <Frown className="w-20 h-20 text-slate-200 mb-6" />
              <h3 className="text-2xl font-black text-slate-600 mb-2">
                {isPhotographer ? 'ยังไม่เคยอัปโหลดรูปลงงานไหนเลย' : 'ยังไม่เคยค้นหารูปในงานไหนเลย'}
              </h3>
              <p className="text-slate-400 font-medium mb-8">
                {isPhotographer ? 'ลองเข้าไปในงานอีเวนต์แล้วกดอัปโหลดรูปดูนะ!' : 'ลองไปเลือกงานอีเวนต์แล้วกดหารูปของตัวเองดูสิ!'}
              </p>
              <Link href="/events" className="btn-secondary text-lg">
                ดูอีเวนต์ทั้งหมด
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(events as any[]).map((event: any) => (
                <Link key={event.id} href={`/events/${event.id}`} className="stagger-item bubbly-card group relative flex flex-col overflow-hidden transition-all duration-300 aspect-[1/1.414] rounded-[28px] border-4 border-white/50 bg-slate-200">
                  {event.poster ? (
                    <img src={`/api/event-image/${event.poster}`} alt={event.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold bg-slate-100">ไม่มีรูปโปสเตอร์</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full border border-white/20">
                    <Camera className="w-4 h-4" />
                    {event.my_photo_count} {isPhotographer ? 'รูปของฉัน' : 'รูปที่เจอ'}
                  </div>
                  <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full justify-end w-full overflow-hidden">
                    <h3 className="text-2xl font-black text-white truncate w-full mb-1 group-hover:text-accent-yellow transition-colors drop-shadow-md">{event.name}</h3>
                    <p className="text-slate-200 text-sm font-medium truncate w-full drop-shadow-md">{event.detail}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
