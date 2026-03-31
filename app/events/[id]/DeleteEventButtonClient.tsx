'use client';

import { useState, useTransition } from 'react';
import { deleteEventAction } from '@/app/actions/event';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteEventButtonClient({ eventId }: { eventId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteEventAction(eventId);
      if (res.success) {
        router.push('/events');
      } else {
        alert(res.error || 'ลบงานไม่สำเร็จ');
        setShowConfirm(false);
      }
    });
  };

  return (
    <>
      {/* Delete button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 px-6 py-4 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 font-black text-lg rounded-full border-2 border-red-200 hover:border-red-300 transition-all active:scale-95"
      >
        <Trash2 className="w-5 h-5" />
        ลบงาน
      </button>

      {/* Confirm dialog via portal-style fixed overlay */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          onClick={() => !isPending && setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-red-100 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">ลบงานอีเวนต์?</h2>
            <p className="text-slate-500 font-medium mb-6">
              รูปภาพทั้งหมดในงานนี้จะถูกลบออกจากระบบและไฟล์บนเซิร์ฟเวอร์ด้วย ไม่สามารถกู้คืนได้
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 py-3 rounded-full border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    กำลังลบ...
                  </>
                ) : (
                  <>ยืนยันลบ</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
