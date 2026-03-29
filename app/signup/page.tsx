"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { animate, stagger, utils } from "animejs";

/* ─── Fun Rounded Icons ─── */
function IconSmile({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function IconCamera({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function IconArrowLeft({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}

function IconSparkles({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" /><path d="M22 5h-4" />
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

function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function SignupPage() {
  const [role, setRole] = useState<'attendee' | 'photographer'>('attendee');

  useEffect(() => {
    // 1. Float and Bounce background blobs (continuous)
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
             <span className="hidden sm:block text-slate-500 font-bold">มีบัญชีแล้ว?</span>
             <Link href="/login" className="px-3 sm:px-5 py-1.5 sm:py-2.5 text-[0.8rem] sm:text-base rounded-full font-bold text-accent-orange border-2 border-accent-orange hover:bg-orange-50 transition-colors whitespace-nowrap">
               เข้าสู่ระบบ
             </Link>
          </div>

        </nav>
      </div>

      {/* ───── Signup Form Container ───── */}
      <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-4">
        <div className="bubbly-card w-full max-w-lg p-8 sm:p-12 relative">
          
          <div className="form-element text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 flex items-center justify-center gap-3">
              สร้างบัญชีผู้ใช้ใหม่ <IconSparkles className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400" />
            </h1>
            <p className="text-slate-500 font-bold">มาร่วมสนุกกับประสบการณ์หารูปที่ไม่เหมือนใคร!</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Role Selection */}
            <div className="form-element flex flex-col gap-3">
              <label className="font-extrabold text-slate-700">คุณเข้าใช้งานในฐานะอะไร?</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setRole('attendee')}
                  className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-4 transition-all duration-300 ${role === 'attendee' ? 'border-accent-pink bg-pink-50 shadow-[0_4px_0_#f472b6] transform -translate-y-1' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'}`}
                >
                  <IconSmile className={`w-8 h-8 ${role === 'attendee' ? 'text-accent-pink' : 'text-slate-300'}`} />
                  <span className={`font-bold text-sm sm:text-base ${role === 'attendee' ? 'text-slate-800' : ''}`}>ฉันมาหารูป</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('photographer')}
                  className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-4 transition-all duration-300 ${role === 'photographer' ? 'border-accent-orange bg-orange-50 shadow-[0_4px_0_#fb923c] transform -translate-y-1' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'}`}
                >
                  <IconCamera className={`w-8 h-8 ${role === 'photographer' ? 'text-accent-orange' : 'text-slate-300'}`} />
                  <span className={`font-bold text-sm sm:text-base ${role === 'photographer' ? 'text-slate-800' : ''}`}>ฉันเป็นตากล้อง</span>
                </button>
              </div>
            </div>

            <div className="h-0.5 w-full bg-slate-100 rounded-full my-2 form-element" />

            {/* Inputs */}
            <div className="form-element flex flex-col gap-2">
              <label className="font-extrabold text-slate-700 pl-2">ชื่อ - นามสกุล</label>
              <input 
                type="text" 
                placeholder="เช่น สมหมาย ใจดี" 
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="form-element flex flex-col gap-2">
              <label className="font-extrabold text-slate-700 pl-2">อีเมล</label>
              <input 
                type="email" 
                placeholder="sommai@example.com" 
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="form-element flex flex-col gap-2">
              <label className="font-extrabold text-slate-700 pl-2">รหัสผ่าน</label>
              <input 
                type="password" 
                placeholder="อย่างน้อย 8 ตัวอักษร" 
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all placeholder:text-slate-300"
              />
            </div>

            <button type="submit" className="form-element flex items-center justify-center gap-2 btn-primary w-full text-xl mt-4">
              สมัคสมาชิกลุยเลย! <IconArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
