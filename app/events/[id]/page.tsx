import { getEventByIdAction, checkEventAccessAction, checkEventRoleAction, getEventCollaboratorsAction } from "@/app/actions/event";
import { getEventPhotosAction, getMyEventPhotosAction } from "@/app/actions/photo";
import { getUserAction } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import UploadButtonClient from "./UploadButtonClient";
import SearchButtonClient from "./SearchButtonClient";
import PhotoGalleryClient from "./PhotoGalleryClient";
import DeleteEventButtonClient from "./DeleteEventButtonClient";
import EventPasswordPromptClient from "./EventPasswordPromptClient";
import { Settings, Users } from "lucide-react";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserAction();

  if (!user) {
    redirect('/login'); // ป้องกันการเข้าถึงหากไม่ได้ล็อกอิน
  }

  const event = await getEventByIdAction(id);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-5xl font-black text-slate-800 mb-6">ไม่พบอีเวนต์นี้ 🥺</h1>
        <Link href="/events" className="px-8 py-4 bg-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-300 transition-colors">กลับไปหน้ารวมอีเวนต์</Link>
      </div>
    );
  }

  const hasAccess = await checkEventAccessAction(id);
  const myRole = await checkEventRoleAction(id);
  const collaborators = await getEventCollaboratorsAction(id);

  let photos: any[] = [];
  let myPhotos: any[] = [];
  let otherPhotos: any[] = [];

  if (hasAccess) {
    photos = await getEventPhotosAction(id);
    otherPhotos = photos;

    if (user.role === 'attendee') {
      myPhotos = await getMyEventPhotosAction(id);

      // กรองรูปที่มีใน myPhotos ออกจาก otherPhotos (เพื่อไม่ให้แสดงรูปซ้ำ)
      if (myPhotos.length > 0) {
        const myPhotoIds = new Set(myPhotos.map(p => p.id));
        otherPhotos = photos.filter((p: any) => !myPhotoIds.has(p.id));
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 flex flex-col pt-32 pb-12 px-6">

      {/* Playful Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="bg-bubble absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] bg-accent-peach/40 rounded-full blur-3xl animate-blob text-slate-800" />
        <div className="bg-bubble absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] bg-accent-yellow/30 rounded-full blur-3xl animate-blob text-slate-800" style={{ animationDelay: '2s' }} />
        <div className="bg-bubble absolute bottom-[-5%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] bg-accent-pink/30 rounded-full blur-3xl animate-blob text-slate-800" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">

        {/* Event Header Banner */}
        <div className="bubbly-card p-4 sm:p-8 flex flex-col md:flex-row gap-8 mb-12 border-t-[8px] border-t-accent-yellow">
          <div className="w-full md:w-[260px] aspect-[1/1.414] rounded-[24px] overflow-hidden bg-slate-200 border-4 border-white flex-shrink-0 shadow-sm relative">
            {event.poster ? (
              <img src={`/api/event-image/${event.poster}`} alt={event.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-400">ไม่มีโปสเตอร์</div>
            )}
          </div>

          <div className="py-6 pr-6 flex-1 flex flex-col">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-800 mb-4 tracking-tight leading-tight">{event.name}</h1>
            <p className="text-lg sm:text-xl text-slate-500 font-medium mb-8 leading-relaxed whitespace-pre-line flex-1">{event.detail}</p>

            {/* 📸 Participating Photographers */}
            <div className="mb-6 flex flex-col gap-3">
              <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4" /> ตากล้องที่มีส่วนร่วมในงานนี้ ({1 + collaborators.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                 {/* Main Owner */}
                 <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-100 rounded-full py-1.5 pl-1.5 pr-4 shadow-sm hover:border-amber-200 transition-colors">
                    <img 
                      src={event.creator_profile ? (event.creator_profile.startsWith('/') ? event.creator_profile : `/api/image/${event.creator_profile}`) : '/api/image/default-profile.png'} 
                      alt={event.creator_name || 'Main Owner'}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <span className="text-sm font-bold text-slate-700">{event.creator_name || 'ผู้สร้างงาน'} <span className="bg-amber-400 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">HOST</span></span>
                 </div>
                 {/* Collaborators */}
                 {collaborators.map((c: any) => (
                   <div key={c.id || c.member_id} className="flex items-center gap-2 bg-slate-50 border-2 border-slate-100 rounded-full py-1.5 pl-1.5 pr-4 shadow-sm hover:border-slate-200 transition-colors">
                      <img 
                        src={c.profile ? (c.profile.startsWith('/') ? c.profile : `/api/image/${c.profile}`) : '/api/image/default-profile.png'} 
                        alt={c.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <span className="text-sm font-bold text-slate-700">{c.name}</span>
                   </div>
                 ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t-4 border-slate-100">
              {hasAccess && (
                user.role === 'photographer' ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-0">
                      {myRole !== 'none' && <UploadButtonClient eventId={event.id} />}
                    </div>
                    {(myRole === 'main_owner' || myRole === 'owner') && (
                      <Link href={`/events/${event.id}/manage`} className="flex items-center justify-center h-full px-5 py-[14px] border-4 border-slate-200 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 hover:text-slate-800 font-bold transition-colors shadow-sm">
                        <Settings className="w-5 h-5" />
                      </Link>
                    )}
                    {(myRole === 'main_owner' || myRole === 'owner') && (
                      <DeleteEventButtonClient eventId={String(event.id)} />
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-md">
                    <SearchButtonClient eventId={event.id} />
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {!hasAccess ? (
          <EventPasswordPromptClient eventId={event.id.toString()} />
        ) : (
          <>
            {/* My Photos Section (เฉพาะ Attendee) */}
            {user.role === 'attendee' && myPhotos.length > 0 && (
              <div className="mb-16">
                <PhotoGalleryClient photos={myPhotos} eventId={event.id} title="รูปที่คุณอยู่ในระบบ" />
                <div className="w-full h-1 bg-slate-200 rounded-full mt-12 mx-auto"></div>
              </div>
            )}

            {/* All Photos Gallery Section (ไม่รวมรูปของฉัน) */}
            {otherPhotos.length > 0 ? (
              <PhotoGalleryClient photos={otherPhotos} eventId={event.id} myRole={myRole} currentUserId={user.id} />
            ) : (
              <div className="text-center py-24 bubbly-card border-dashed">
                <h3 className="text-5xl font-black text-slate-300 mb-6 animate-bounce-slow">📸</h3>
                <h3 className="text-3xl font-black text-slate-400 mb-2">ยังไม่มีรูปภาพในอัลบั้ม</h3>
                <p className="text-slate-400 font-bold text-lg">
                  {user.role === 'photographer' ? 'ประเดิมอัปโหลดรูปแรกให้งานนี้เลยสิ!' : 'ตากล้องกำลังแต่งรูปให้สวยๆ อดใจรอสักนิดนะ 🚧'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
