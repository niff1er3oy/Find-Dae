'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { verifyEventPasswordAction } from "@/app/actions/event";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";

export default function EventPasswordPromptClient({ eventId }: { eventId: string }) {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setErrorMsg("");
    startTransition(async () => {
      const res = await verifyEventPasswordAction(eventId, password);
      if (res.success) {
        setPassword("");
        router.refresh();
      } else {
        setErrorMsg(res.error || "รหัสผ่านไม่ถูกต้อง");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/60 animate-fade-in">
      <div className="bubbly-card relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden border-t-[8px] border-t-accent-orange animate-pop-in">
        
        {/* Background abstract decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-yellow/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-pink/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm shadow-orange-100">
            <Lock className="w-10 h-10 text-accent-orange" />
          </div>

          <h2 className="text-3xl font-black text-slate-800 text-center mb-2">งานนี้มีรหัสผ่าน 🔒</h2>
          <p className="text-slate-500 font-bold text-center mb-8 leading-relaxed">
            ตากล้องผู้จัดงานตั้งรหัสผ่านเอาไว้<br />กรุณากรอกรหัสผ่านเพื่อเข้าดูภาพ
          </p>

          {errorMsg && (
            <div role="alert" className="mb-6 w-full p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-600 font-bold flex items-center justify-center gap-2 animate-bounce-short">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="number"
              placeholder="กรอกรหัส PIN ที่นี่..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-center px-6 py-4 text-2xl tracking-widest rounded-2xl border-4 border-slate-100 bg-slate-50 font-black text-slate-800 focus:border-accent-orange focus:bg-white focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all placeholder:text-slate-400"
              autoFocus
            />
            
            <button
              type="submit"
              disabled={isPending || !password}
              className="w-full mt-2 py-4 rounded-2xl font-black text-xl text-white bg-accent-orange shadow-[0_6px_0_#cc5500] hover:-translate-y-1 hover:shadow-[0_10px_0_#cc5500] active:translate-y-1 active:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isPending ? 'กำลังตรวจสอบ...' : 'ปลดล็อกงานเลย!'}
              {!isPending && <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <button 
            type="button" 
            onClick={() => router.push('/events')}
            className="mt-6 text-slate-500 font-bold hover:text-slate-700 transition-colors underline decoration-slate-300 underline-offset-4"
          >
            ยกเลิกและกลับไปหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}
