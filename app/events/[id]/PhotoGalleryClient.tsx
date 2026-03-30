'use client';

import { useState, useEffect } from 'react';

export default function PhotoGalleryClient({ photos, eventId, title = "อัลบั้มรูปภาพ", icon = "📸" }: { photos: any[], eventId: string, title?: string, icon?: string }) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // ปิด Popup เมื่อผู้ใช้กดปุ่ม ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    if (selectedPhoto) {
       document.documentElement.style.overflow = 'hidden'; // ล็อกการเลื่อนหน้าจอตอนเปิด popup
       window.addEventListener('keydown', handleKeyDown);
    } else {
       document.documentElement.style.overflow = '';
    }
    return () => {
       document.documentElement.style.overflow = '';
       window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto]);

  return (
    <div className="mb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          {icon} {title} <span className="text-accent-pink text-2xl">({photos.length})</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {photos.map((photo: any) => {
          const photoUrl = `/api/event-photo/${eventId}/${photo.image_path}`;
          return (
            <div 
               key={photo.id} 
               onClick={() => setSelectedPhoto(photoUrl)}
               className="aspect-square bg-slate-200 rounded-2xl overflow-hidden group relative border-4 border-white shadow-sm hover:shadow-xl hover:border-accent-yellow transition-all duration-300 cursor-pointer"
            >
              <img 
                src={photoUrl} 
                alt={`Photo ${photo.id}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-white/90 text-slate-800 px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
                    คลิกเพื่อดูรูปเต็ม
                  </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Fullscreen Image Popup (Lightbox) */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4 sm:p-8 cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* ปุ่มกากบาทปิด (มุมขวาบน) */}
          <button 
             className="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm shadow-lg z-50 cursor-pointer"
             onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* 
            ใช้ max-w-[95vw] และ max-h-[90vh] ควบคุมไม่ให้ภาพใหญ่ทะลุจอ
            และไม่ใช้ w-full ยืดภาพกว้างเกินขนาดจริง เพื่อรักษาสัดส่วนและขนาดสูงสุดของภาพเอาไว้
          */}
          <img 
            src={selectedPhoto} 
            alt="Full screen photo" 
            className="rounded-xl shadow-2xl object-contain animate-pop-in pointer-events-none"
            style={{
              maxWidth: '95vw',
              maxHeight: '90vh'
            }}
          />
        </div>
      )}
    </div>
  );
}
