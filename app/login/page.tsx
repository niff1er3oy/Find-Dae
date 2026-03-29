"use client";

import Link from "next/link";
import { useEffect } from "react";
import { animate, stagger, utils } from "animejs";

/* ─── Fun Rounded Icons ─── */
function IconArrowLeft({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}

function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconUserRound({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function LoginPage() {
  useEffect(() => {
    // 1. Float and Bounce background blobs
    animate('.bg-bubble', {
      translateY: () => utils.random(-40, 40),
      translateX: () => utils.random(-40, 40),
      scale: () => utils.random(0.9, 1.1),
      duration: () => utils.random(4000, 8000),
      direction: 'alternate',
      loop: true,
      ease: 'inOutQuad'
    });

    // 2. Playful Form Entry Animation
    animate('.form-element', {
      opacity: [0, 1],
      translateY: [40, 0],
      rotate: [utils.random(-3, 3), 0],
      duration: 1000,
      delay: stagger(100),
      ease: 'spring(1, 80, 12, 0)'
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 flex flex-col">
      
      {/* ───── Playful Background Blobs ───── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="bg-bubble absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] bg-accent-peach/40 rounded-full blur-3xl animate-blob" />
        <div className="bg-bubble absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] bg-accent-yellow/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="bg-bubble absolute bottom-[-5%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] bg-accent-pink/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      {/* ───── Floating Pill Navbar ───── */}
      <div className="fixed top-4 inset-x-4 sm:inset-x-6 flex justify-center z-50 pointer-events-none">
        <nav className="w-full max-w-5xl bg-white/90 backdrop-blur-xl border-4 border-white pointer-events-auto rounded-[2rem] shadow-[0_10px_30px_rgba(255,140,66,0.1)] px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between transition-all hover:shadow-[0_15px_40px_rgba(255,140,66,0.15)] gap-2 sm:gap-4">
          
          <Link href="/" className="flex flex-shrink-0 items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent-orange rounded-full flex items-center justify-center text-white shadow-md transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
              <IconArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="hidden sm:inline-block text-lg font-bold text-slate-500 hover:text-accent-orange transition-colors">ย้อนกลับ</span>
          </Link>

          <Link href="/" className="flex flex-shrink min-w-0 justify-center items-center group">
             <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800 flex items-center gap-1 sm:gap-2">
               <span className="truncate">Find</span><span className="text-accent-orange truncate">Dae!</span>
               <IconSearch className="text-accent-orange flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 animate-bounce-slow" />
             </span>
          </Link>

          <div className="flex items-center gap-3 flex-shrink-0">
             <span className="hidden md:block text-slate-500 font-bold">หรือถ้ายังไม่มีบัญชี...</span>
             <Link href="/signup" className="px-3 sm:px-5 py-1.5 sm:py-2.5 text-[0.8rem] sm:text-base rounded-full font-bold text-accent-orange border-2 border-accent-orange hover:bg-orange-50 transition-colors whitespace-nowrap">
               สมัครใช้งานใหม่!
             </Link>
          </div>

        </nav>
      </div>

      {/* ───── Login Form Container ───── */}
      <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-4">
        <div className="bubbly-card w-full max-w-md p-8 sm:p-12 relative border-t-[8px] border-t-accent-orange">
          
          <div className="form-element text-center mb-10 mt-2">
            <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center justify-center gap-3">
              ยินดีต้อนรับกลับมา! <IconUserRound className="w-8 h-8 text-accent-orange" />
            </h1>
            <p className="text-slate-500 font-bold">ล็อกอินเข้าสู่ระบบค้นหารูปสุดล้ำของคุณ</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            
            <div className="form-element flex flex-col gap-2">
              <label className="font-extrabold text-slate-700 pl-2">อีเมล</label>
              <input 
                type="email" 
                placeholder="sommai@example.com" 
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="form-element flex flex-col gap-2 relative">
              <div className="flex justify-between items-center pr-2">
                <label className="font-extrabold text-slate-700 pl-2">รหัสผ่าน</label>
                <a href="#" className="font-bold text-sm text-accent-orange hover:text-orange-600 transition-colors">
                  ลืมรหัสผ่านใช่ไหม?
                </a>
              </div>
              <input 
                type="password" 
                placeholder="กรอกรหัสผ่านของคุณ" 
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all placeholder:text-slate-300"
              />
            </div>

            <button type="submit" className="form-element btn-primary w-full text-xl mt-6 flex justify-center items-center gap-2">
              ลงชื่อเข้าใช้ <IconArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
            
          </form>

        </div>
      </div>
    </div>
  );
}
