'use client';

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createEventAction } from "@/app/actions/event";
import Link from 'next/link';
import { Key, RefreshCw, Trash2 } from 'lucide-react';

export default function CreateEventPage() {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleRandomPassword = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPassword(randomPin);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('รูปโปสเตอร์ต้องมีขนาดไม่เกิน 10 MB');
        e.target.value = '';
        setPreview(null);
        return;
      }
      setErrorMsg('');
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setErrorMsg('');
    const formData = new FormData(formRef.current);

    startTransition(async () => {
      const res = await createEventAction(formData);
      if (res.success) {
        // หากสำเร็จให้เด้งกลับไปที่หน้ารวมอีเวนต์
        router.push('/events');
      } else {
        setErrorMsg(res.error || 'เกิดข้อผิดพลาดในการสร้างอีเวนต์');
      }
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 flex justify-center items-center pt-32 pb-12 px-4 sm:px-6">
      
      {/* Playful Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="bg-bubble absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] bg-accent-peach/40 rounded-full blur-3xl animate-blob text-slate-800" />
        <div className="bg-bubble absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] bg-accent-yellow/30 rounded-full blur-3xl animate-blob text-slate-800" style={{ animationDelay: '2s' }} />
        <div className="bg-bubble absolute bottom-[-5%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] bg-accent-pink/30 rounded-full blur-3xl animate-blob text-slate-800" style={{ animationDelay: '4s' }} />
      </div>

      <div className="bubbly-card w-full max-w-2xl p-8 sm:p-12 relative border-t-[8px] border-t-accent-orange z-10">
        
        <div className="mb-8 flex items-center justify-between">
           <div>
             <h1 className="text-3xl sm:text-4xl font-black text-slate-800">สร้างอีเวนต์ใหม่ 📸</h1>
             <p className="text-slate-500 font-bold mt-2">อัปโหลดงานเพื่อเริ่มต้อนรับผู้เข้าร่วมงาน</p>
           </div>
           <Link href="/events" className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-95 transition-all">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
           </Link>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-600 font-bold text-center animate-bounce-short">
            {errorMsg}
          </div>
        )}

        <form ref={formRef} onSubmit={handleCreate} className="flex flex-col gap-6">
           
           <div className="flex flex-col gap-2">
             <label className="font-extrabold text-slate-700 pl-2 text-lg">ชื่ออีเวนต์</label>
             <input type="text" name="name" required placeholder="เช่น งานวิ่งมาราธอน 2026..." className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all text-lg" />
           </div>

           <div className="flex flex-col gap-2">
             <label className="font-extrabold text-slate-700 pl-2 text-lg">รายละเอียดงาน</label>
             <textarea name="detail" required rows={3} placeholder="อธิบายเกี่ยวกับงานแบบย่อๆ..." className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all text-lg resize-none"></textarea>
           </div>

           <div className="flex flex-col gap-2">
             <div className="flex items-center justify-between pl-2">
               <label className="font-extrabold text-slate-700 text-lg flex items-center gap-2">
                 <Key className="w-5 h-5 text-accent-orange" />
                 รหัสผ่านเข้าดูอีเวนต์ (ตัวเลือก)
               </label>
             </div>
             <div className="flex flex-col sm:flex-row gap-3">
               <input 
                 type="number" 
                 name="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="ปล่อยว่างไว้หากเป็นงานสาธารณะ..." 
                 className="w-full sm:flex-1 px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all text-lg" 
               />
               <div className="flex gap-2">
                 <button 
                   type="button" 
                   onClick={handleRandomPassword}
                   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-accent-yellow text-amber-900 font-bold rounded-2xl border-b-4 border-amber-600 hover:translate-y-1 hover:border-b-0 transition-all whitespace-nowrap"
                 >
                   <RefreshCw className="w-5 h-5" /> สุ่มรหัส
                 </button>
                 <button 
                   type="button" 
                   onClick={() => setPassword('')}
                   disabled={!password}
                   className="flex items-center justify-center px-4 py-4 bg-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-red-100 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   title="ลบรหัสผ่าน"
                 >
                   <Trash2 className="w-5 h-5" />
                 </button>
               </div>
             </div>
             <p className="text-sm font-bold text-slate-400 pl-2">หากตั้งรหัสผ่าน ผู้ร่วมงานจะต้องกรอกรหัสผ่านก่อนดูรูปถ่าย</p>
           </div>

           <div className="flex flex-col gap-2 mt-2">
             <label className="font-extrabold text-slate-700 pl-2 text-lg">รูปโปสเตอร์ปกงาน (จำเป็น)</label>
             
             <div className="w-full h-80 bg-slate-50 border-4 border-dashed border-slate-200 hover:border-accent-orange/50 transition-colors rounded-[32px] overflow-hidden relative flex flex-col items-center justify-center group">
               {preview ? (
                 <img src={preview} alt="Preview" className="w-full h-full object-cover animate-pop-in" />
               ) : (
                 <div className="text-slate-400 font-bold flex flex-col items-center">
                    <svg className="w-16 h-16 mb-3 opacity-30 group-hover:scale-110 group-hover:text-accent-orange transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    คลิกเพื่ออัปโหลดแนบโปสเตอร์
                 </div>
               )}
               <input type="file" name="poster" accept="image/*" required onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
             </div>
           </div>

           <button 
             type="submit" 
             disabled={isPending}
             className="w-full mt-4 py-5 rounded-full font-black text-2xl text-white bg-accent-orange shadow-[0_6px_0_#cc5500] hover:-translate-y-1 hover:shadow-[0_10px_0_#cc5500] active:translate-y-2 active:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isPending ? 'กำลังเปิดงานลุยย...' : 'สร้างงานเลย! ✨'}
           </button>
        </form>

      </div>
    </div>
  )
}
