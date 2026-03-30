import { getEventByIdAction } from "@/app/actions/event";
import { getEventPhotosAction, getMyEventPhotosAction } from "@/app/actions/photo";
import { getUserAction } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import UploadButtonClient from "./UploadButtonClient";
import SearchButtonClient from "./SearchButtonClient";
import PhotoGalleryClient from "./PhotoGalleryClient";

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

  const photos = await getEventPhotosAction(id);
  
  let myPhotos: any[] = [];
  let otherPhotos = photos;

  if (user.role === 'attendee') {
     myPhotos = await getMyEventPhotosAction(id);
     
     // กรองรูปที่มีใน myPhotos ออกจาก otherPhotos (เพื่อไม่ให้แสดงรูปซ้ำ)
     if (myPhotos.length > 0) {
       const myPhotoIds = new Set(myPhotos.map(p => p.id));
       otherPhotos = photos.filter((p: any) => !myPhotoIds.has(p.id));
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

        <Link href="/events" className="inline-flex items-center gap-2 font-bold text-slate-500 hover:text-accent-orange mb-8 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          กลับหน้ารวมงาน
        </Link>

        {/* Event Header Banner */}
        <div className="bubbly-card p-4 sm:p-8 flex flex-col md:flex-row gap-8 mb-12 border-t-[8px] border-t-accent-yellow">
          <div className="w-full md:w-1/3 h-72 md:h-auto rounded-[24px] overflow-hidden bg-slate-200 border-4 border-white flex-shrink-0 shadow-sm relative">
            {event.poster ? (
              <img src={`/api/event-image/${event.poster}`} alt={event.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">ไม่มีโปสเตอร์</div>
            )}
          </div>

          <div className="py-6 pr-6 flex-1 flex flex-col">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-800 mb-4 tracking-tight leading-tight">{event.name}</h1>
            <p className="text-lg sm:text-xl text-slate-500 font-medium mb-8 leading-relaxed whitespace-pre-line flex-1">{event.detail}</p>

            <div className="mt-auto pt-6 border-t-4 border-slate-100">
              <div className="w-full max-w-md">
                {user.role === 'photographer' ? (
                  <UploadButtonClient eventId={event.id} />
                ) : (
                  <SearchButtonClient eventId={event.id} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* My Photos Section (เฉพาะ Attendee) */}
        {user.role === 'attendee' && myPhotos.length > 0 && (
          <div className="mb-16">
            <PhotoGalleryClient photos={myPhotos} eventId={event.id} title="รูปที่คุณอยู่ในระบบ" icon="✨" />
            <div className="w-full h-1 bg-slate-200 rounded-full mt-12 mx-auto"></div>
          </div>
        )}

        {/* All Photos Gallery Section (ไม่รวมรูปของฉัน) */}
        {otherPhotos.length > 0 ? (
          <PhotoGalleryClient photos={otherPhotos} eventId={event.id} />
        ) : (
          <div className="text-center py-24 bubbly-card border-dashed">
            <h3 className="text-5xl font-black text-slate-300 mb-6 animate-bounce-slow">📸</h3>
            <h3 className="text-3xl font-black text-slate-400 mb-2">ยังไม่มีรูปภาพในอัลบั้ม</h3>
            <p className="text-slate-400 font-bold text-lg">
              {user.role === 'photographer' ? 'ประเดิมอัปโหลดรูปแรกให้งานนี้เลยสิ!' : 'ตากล้องกำลังแต่งรูปให้สวยๆ อดใจรอสักนิดนะ 🚧'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
