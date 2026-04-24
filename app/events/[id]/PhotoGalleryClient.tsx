'use client';

import { useState, useEffect, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { deletePhotoAction } from '@/app/actions/photo';
import { useRouter } from 'next/navigation';
import { Camera, Trash2, X, Download } from 'lucide-react';

export default function PhotoGalleryClient({
  photos: initialPhotos,
  eventId,
  title = "อัลบั้มรูปภาพ",
  myRole = "none",
  currentUserId,
}: {
  photos: any[],
  eventId: string,
  title?: string,
  myRole?: string,
  currentUserId?: number

}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; id: number } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    if (selectedPhoto) {
      document.documentElement.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto]);

  const handleDelete = (photoId: number) => {
    setDeletingId(photoId);
    startTransition(async () => {
      const res = await deletePhotoAction(photoId, eventId);
      if (res.success) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
        if (selectedPhoto?.id === photoId) setSelectedPhoto(null);
      } else {
        alert(res.error || 'ลบไม่สำเร็จ');
      }
      setDeletingId(null);
    });
  };

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    try {
      const res = await fetch(`/api/download-event/${eventId}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || '\u0e14\u0e32\u0e27\u0e42\u0e2b\u0e25\u0e14\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08');
        return;
      }
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `event_${eventId}_photos.7z`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      alert('\u0e40\u0e01\u0e34\u0e14\u0e02\u0e49\u0e2d\u0e1c\u0e34\u0e14\u0e1e\u0e25\u0e32\u0e14\u0e43\u0e19\u0e01\u0e32\u0e23\u0e14\u0e32\u0e27\u0e42\u0e2b\u0e25\u0e14');
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <div className="mb-24">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <Camera className="w-8 h-8 text-accent-pink" /> {title}
        </h2>
        {photos.length > 0 && (
          <button
            onClick={handleDownloadAll}
            disabled={isDownloadingAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-accent-orange hover:text-accent-orange text-slate-600 font-bold rounded-full shadow-sm transition-all active:scale-95 disabled:opacity-50 text-sm"
          >
            {isDownloadingAll ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                กำลังดาวโหลด...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                ดาวโหลดทั้งหมด ({photos.length})
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {photos.map((photo: any) => {
          const photoUrl = `/api/event-photo/${eventId}/${photo.image_path}`;
          const isDeleting = deletingId === photo.id;
          const canDeletePhoto = myRole === 'main_owner' || myRole === 'owner' || (myRole === 'photographer' && photo.photographer_id === currentUserId);
          return (
            <div
              key={photo.id}
              className="photo-card-item aspect-square bg-slate-200 rounded-2xl overflow-hidden group relative border-4 border-white shadow-sm hover:shadow-xl hover:border-accent-yellow transition-all duration-300"
            >
              <img
                src={photoUrl}
                alt={`Photo ${photo.id}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                loading="lazy"
                onClick={() => setSelectedPhoto({ url: photoUrl, id: photo.id })}
              />

              {/* Hover overlay with view label — hidden on mobile touch devices */}
              <div
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 pointer-events-none hidden sm:flex"
              >
                <span className="bg-white/90 text-slate-800 px-4 py-2 rounded-full font-bold text-sm shadow-sm">
                  คลิกเพื่อดูรูปเต็ม
                </span>
              </div>

              {/* Delete button (photographer only) — always visible on mobile, hover-only on desktop */}
              {canDeletePhoto && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }}
                  disabled={isDeleting}
                  className="absolute top-2 right-2 z-10 w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox — rendered via Portal to escape parent z-index stacking context */}
      {selectedPhoto && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8 cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm shadow-lg cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Bottom action bar: Download (always) + Delete (photographer only) */}
          <div
            className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 w-max"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={selectedPhoto.url}
              download
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-xl transition-colors cursor-pointer border border-white/20 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              ดาวโหลด
            </a>
            {(() => {
                const sp = photos.find(p => p.id === selectedPhoto.id);
                const canDeleteSp = sp && (myRole === 'main_owner' || myRole === 'owner' || (myRole === 'photographer' && sp.photographer_id === currentUserId));
                if (!canDeleteSp) return null;
                return (
                  <button
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-xl transition-colors cursor-pointer text-sm sm:text-base"
                    onClick={() => handleDelete(selectedPhoto.id)}
                    disabled={deletingId === selectedPhoto.id}
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    ลบรูปนี้
                  </button>
                );
            })()}
          </div>

          <img
            src={selectedPhoto.url}
            alt="Full screen photo"
            className="rounded-xl shadow-2xl object-contain animate-pop-in pointer-events-none"
            style={{ maxWidth: '95vw', maxHeight: '85vh' }}
          />
        </div>,
        document.body
      )}
    </div>
  );
}
