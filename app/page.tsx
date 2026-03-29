"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, stagger, utils } from "animejs";

/* ─── Fun Rounded Icons (Feather/Lucide style) ─── */
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
function IconScan({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="4" />
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
function IconStar({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
function IconHeart({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
function IconMousePointer({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path d="M13 13l6 6" />
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
function IconMenu({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function IconClose({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ─── Playful Components ─── */
function FeatureBlob({ title, desc, icon, colorClass, rotate }: { title: string, desc: string, icon: React.ReactNode, colorClass: string, rotate: string }) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs mx-auto group cursor-default">
      <div className={`w-24 h-24 mb-6 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${colorClass} ${rotate} animate-float-soft`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scannerImageRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Springy entry animations for hero elements
    animate('.hero-pop', {
      opacity: [0, 1],
      scale: [0.5, 1],
      translateY: [40, 0],
      duration: 1200,
      delay: stagger(150),
      ease: 'spring(1, 80, 12, 0)'
    });

    // 2. Playful scanner animation
    if (scanLineRef.current && scannerImageRef.current) {
      animate(scanLineRef.current, {
        translateY: [0, 180],
        duration: 2500,
        direction: 'alternate',
        loop: true,
        ease: 'inOutSine'
      });

      animate(scannerImageRef.current, {
        rotate: [-3, 3],
        duration: 4000,
        loop: true,
        direction: 'alternate',
        ease: 'inOutQuad'
      });
    }

    // 3. Float and Bounce background blobs (continuous)
    animate('.bg-bubble', {
      translateY: () => utils.random(-40, 40),
      translateX: () => utils.random(-40, 40),
      scale: () => utils.random(0.9, 1.1),
      duration: () => utils.random(4000, 8000),
      direction: 'alternate',
      loop: true,
      ease: 'inOutQuad'
    });

    // 4. Scroll trigger animations (bouncy reveals)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;

          if (target.id === 'roles-section') {
            animate('.role-card', {
              opacity: [0, 1],
              translateY: [60, 0],
              rotate: [utils.random(-5, 5), 0],
              delay: stagger(150),
              duration: 1000,
              ease: 'spring(1, 80, 12, 0)'
            });
            observer.unobserve(target);
          }

          if (target.id === 'features-section') {
            animate('.feature-item', {
              opacity: [0, 1],
              scale: [0.8, 1],
              delay: stagger(100),
              duration: 1000,
              ease: 'spring(1, 80, 12, 0)'
            });
            observer.unobserve(target);
          }
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('#roles-section, #features-section').forEach(el => observer.observe(el));

    // Handle mobile menu toggle animation natively via anime.js
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      animate('.mobile-menu', { opacity: [0, 1], translateY: [-20, 0], duration: 300, ease: 'outQuad' });
      animate('.mobile-links > a', { opacity: [0, 1], translateY: [20, 0], delay: stagger(50), duration: 400, ease: 'outBack' });
    } else {
      document.body.style.overflow = '';
    }

    return () => observer.disconnect();
  }, [isMenuOpen]);

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800">

      {/* ───── Playful Background Blobs ───── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="bg-bubble absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] bg-accent-peach/40 rounded-full blur-3xl animate-blob" />
        <div className="bg-bubble absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] bg-accent-yellow/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="bg-bubble absolute bottom-[-5%] left-[10%] w-[30vw] h-[30vw] max-w-[600px] bg-accent-pink/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      {/* ───── Floating Floating Pill Navbar ───── */}
      <div className="fixed top-4 inset-x-4 sm:inset-x-6 flex justify-center z-50 pointer-events-none">
        <nav className="w-full max-w-5xl bg-white/90 backdrop-blur-xl border-4 border-white pointer-events-auto rounded-full shadow-[0_10px_30px_rgba(255,140,66,0.1)] px-6 py-3 flex items-center justify-between transition-all hover:shadow-[0_15px_40px_rgba(255,140,66,0.15)]">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="w-10 h-10 bg-accent-orange rounded-full flex items-center justify-center text-white shadow-md transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <IconSearch className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-800">
              Find<span className="text-accent-orange"> Dae!</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-bold text-slate-500">
            <a href="#roles" className="hover:text-accent-orange transition-colors">ฉันเป็นใคร?</a>
            <a href="#features-section" className="hover:text-accent-pink transition-colors">ข้อดี</a>
            <a href="#how-it-works" className="hover:text-accent-yellow transition-colors">ทำยังไง?</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-5 py-2.5 rounded-full font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              เข้าสู่ระบบ
            </Link>
            <Link href="/signup" className="flex items-center justify-center bg-accent-orange text-white px-6 py-2.5 rounded-full font-bold shadow-[0_4px_0_#cc5500] hover:-translate-y-1 hover:shadow-[0_6px_0_#cc5500] active:translate-y-1 active:shadow-[0_0px_0_#cc5500] transition-all">
              สมัครเลย!
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex items-center justify-center w-12 h-12 text-slate-600 rounded-full bg-slate-50 active:scale-95 transition-transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl flex flex-col justify-center px-8 md:hidden overflow-y-auto overscroll-contain">
          <div className="mobile-links flex flex-col gap-8 text-3xl font-extrabold text-center my-auto py-12">
            <a href="#roles" onClick={() => setIsMenuOpen(false)} className="text-slate-800 hover:text-accent-orange">ฉันเป็นใคร?</a>
            <a href="#features-section" onClick={() => setIsMenuOpen(false)} className="text-slate-800 hover:text-accent-pink">ข้อดี</a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-slate-800 hover:text-accent-yellow">ทำยังไง?</a>
            <div className="h-2 w-16 bg-accent-peach rounded-full mx-auto my-4 shrink-0" />
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-2xl text-slate-500 hover:text-accent-orange transition-colors">เข้าสู่ระบบ</Link>
            <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center bg-accent-orange text-white py-4 rounded-full shadow-[0_6px_0_#cc5500] w-full max-w-xs mx-auto active:translate-y-2 active:shadow-none transition-all text-xl shrink-0">
              สมัครสมาชิกเลย!
            </Link>
          </div>
        </div>
      )}

      {/* ───── Hero Area ───── */}
      <section className="relative pt-40 pb-20 sm:pt-48 sm:pb-32 px-6 flex flex-col items-center justify-center text-center min-h-[95vh] z-10">

        <div className="hero-pop bg-white/60 border-2 border-white backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-accent-orange font-bold text-sm mb-8 flex items-center gap-2">
          <IconSparkles className="w-4 h-4" /> ระบบ AI ช่วยค้นหารูปในงานอีเวนต์!
        </div>

        <h1 className="hero-pop text-5xl sm:text-7xl font-black text-slate-800 tracking-tight leading-[1.1] max-w-4xl drop-shadow-sm">
          เลิกไถหารูปจนเมื่อยนิ้ว!
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          มาใช้ <span className="gradient-text-fun px-2">Find Dae</span> ดีกว่า <IconSparkles className="inline w-10 h-10 sm:w-12 sm:h-12 text-accent-yellow -mt-2 animate-bounce-slow" />
        </h1>

        <p className="hero-pop mt-8 text-lg sm:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed">
          ตากล้องอัปโหลดรูปปุ๊บ ผู้เข้าร่วมแค่เซลฟี่ 1 รูปปั๊บ
          เราหาหน้าคุณเจอทันทีในเสี้ยววิ!
        </p>

        <div className="hero-pop mt-12 flex flex-col sm:flex-row gap-5 w-full sm:w-auto px-4 sm:px-0">
          <button className="btn-primary w-full sm:w-auto text-lg flex items-center justify-center gap-3">
            <IconSearch className="w-6 h-6" /> ตามหารูปฉัน!
          </button>
          <button className="btn-secondary w-full sm:w-auto text-lg flex items-center justify-center gap-3">
            <IconCamera className="w-6 h-6" /> สำหรับตากล้อง
          </button>
        </div>

        {/* Playful Hero Visual */}
        <div className="hero-pop mt-20 relative w-full justify-center flex">
          <div ref={scannerImageRef} className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] bg-white rounded-[40px] shadow-2xl p-4 border-[6px] border-white origin-bottom">
            {/* Inner Photo */}
            <div className="w-full h-full bg-slate-100 rounded-[28px] overflow-hidden relative border-4 border-slate-50">
              {/* Photo placeholder / avatar styling */}
              <div className="absolute inset-x-8 bottom-0 top-16 bg-accent-peach rounded-t-[100px]" />
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-24 h-24 bg-[#ffdfc4] rounded-[40%] flex items-center justify-center shadow-sm">
                <IconSmile className="w-12 h-12 text-slate-700 opacity-60" />
              </div>

              {/* Scanning UI overlay */}
              <div className="absolute inset-x-4 top-[15%] bottom-[45%] border-4 border-dashed border-accent-orange/80 rounded-3xl" />

              {/* The Laser */}
              <div ref={scanLineRef} className="absolute left-0 w-full top-0">
                <div className="w-full h-2 bg-accent-orange rounded-full shadow-[0_0_20px_#ff8c42,0_0_10px_#ff8c42]" />
                <div className="absolute left-1/2 -translate-x-1/2 -mt-1 bg-white border-2 border-accent-orange px-3 py-1 text-[10px] font-bold text-accent-orange rounded-full shadow-lg">
                  SCANNING...
                </div>
              </div>
            </div>

            {/* Floating Match Badges */}
            <div className="absolute -right-12 sm:-right-16 top-10 bg-white p-3 rounded-2xl shadow-xl animate-float-soft border-2 border-white rotate-6">
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-accent-yellow rounded-xl" />
                <div className="w-12 h-12 bg-accent-pink rounded-xl" />
              </div>
              <div className="mt-2 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md text-center">เจอ +12 รูป!</div>
            </div>

            <div className="absolute -left-10 sm:-left-12 bottom-12 bg-white px-4 py-3 rounded-2xl shadow-xl animate-bounce-slow border-2 border-white -rotate-6 flex items-center gap-2">
              <IconStar className="text-yellow-400 w-6 h-6 fill-yellow-400" />
              <span className="font-extrabold text-slate-700">Matched 99.9%</span>
            </div>
          </div>
        </div>

      </section>

      {/* ───── Roles Section ───── */}
      <section id="roles" className="py-24 px-6 relative z-10">
        <div id="roles-section" className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-4 flex items-center justify-center gap-3">
              ตกลงคุณมาในถานะอะไร? <IconSmile className="w-10 h-10 sm:w-12 sm:h-12 text-accent-orange" />
            </h2>
            <p className="text-xl text-slate-500 font-medium">แบ่งเส้นสายงานชัดเจน เพื่อความลื่นไหลที่สุด!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Attendee */}
            <div className="role-card bubbly-card p-8 sm:p-10 flex flex-col items-center text-center opacity-0">
              <div className="w-24 h-24 bg-gradient-to-br from-accent-pink to-pink-300 rounded-3xl mb-8 flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-12 transition-transform">
                <IconSmile className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4">สายโดนแอบถ่าย</h3>
              <p className="text-lg text-slate-500 font-medium mb-8">
                เพิ่งกลับจากงานคอนเสิร์ต งานวิ่ง แต่งงานต่างๆ อยากหารูปตัวเองใช่มั้ย? อัพโหลดรูปเซลฟี่คุณ 1 รูป แล้วปล่อยให้เราหาให้เลย!
              </p>
              <button className="mt-auto w-full btn-primary btn-pink">
                เริ่มหารูปตัวเอง
              </button>
            </div>

            {/* Photographer */}
            <div className="role-card bubbly-card p-8 sm:p-10 flex flex-col items-center text-center opacity-0 delay-100">
              <div className="w-24 h-24 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-3xl mb-8 flex items-center justify-center text-white shadow-lg -rotate-3 group-hover:-rotate-12 transition-transform">
                <IconCamera className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4">สายตากล้องกดแชะ</h3>
              <p className="text-lg text-slate-500 font-medium mb-8">
                อัพโหลดรูปแบบเหมาแผง! โยนรูปทั้งหมดเข้าอัลบั้ม ปล่อยให้ระบบเราจัดการ AI แท็กหน้าให้ลูกค้ามาค้นหาเจอสบายๆ
              </p>
              <button className="mt-auto w-full btn-primary cursor-pointer">
                จัดการรูปถ่ายของฉัน
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───── 3 Steps Section (How it works) ───── */}
      <section id="how-it-works" className="py-24 px-6 relative z-10 bg-white/50 border-y-4 border-white backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-16 flex items-center justify-center gap-3">
            มันทำงานยังไงน้าา? <IconSearch className="w-10 h-10 sm:w-12 sm:h-12 text-accent-peach" />
          </h2>

          <div className="grid sm:grid-cols-3 gap-12 relative">
            {/* Decorative connecting line for desktop */}
            <div className="hidden sm:block absolute top-[48px] left-[15%] right-[15%] h-2 bg-slate-100 rounded-full z-[-1]">
              <div className="h-full bg-accent-orange/30 w-1/2 animate-shimmer rounded-full" />
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center text-3xl font-black text-accent-orange shadow-xl mb-6 relative">
                1
                <div className="absolute -top-3 -right-3 bg-accent-yellow w-8 h-8 rounded-full border-2 border-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">เลือกลิงก์อัลบั้ม</h3>
              <p className="text-slate-500 font-medium max-w-[250px]">จิ้มลิงก์ที่ตากล้องหรือแอดมินงานแจกให้</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center text-3xl font-black text-accent-pink shadow-xl mb-6 relative">
                2
                <div className="absolute -top-3 -right-3 bg-accent-peach w-8 h-8 rounded-full border-2 border-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">ยิ้มแล้วเซลฟี่ซักแชะ!</h3>
              <p className="text-slate-500 font-medium max-w-[250px]">ส่งรูปหน้าตัวเองชัดๆ ให้ระบบรู้จัก</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center text-3xl font-black text-accent-blue shadow-xl mb-6 relative">
                3
                <div className="absolute -top-3 -right-3 bg-green-400 w-8 h-8 rounded-full border-2 border-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">เซฟรูปลงเครื่องไปเลย!</h3>
              <p className="text-slate-500 font-medium max-w-[250px]">AI จะคัดรูปที่มีหน้าคุณทั้งหมดมาโชว์ทันที</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="features-section" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-4 flex items-center justify-center gap-3">
              จุดเด่นที่ทำให้ใครๆ ก็หลงรัก <IconHeart className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400 fill-pink-400 animate-pulse" />
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="feature-item opacity-0">
              <FeatureBlob
                title="แม่นยำเวอร์ๆ"
                desc="แก่นของระบบใช้ Face Recognition AI ตัวท็อป หน้าสั่นหันข้างก็ยังรอด!"
                icon={<IconScan className="w-10 h-10" />}
                colorClass="bg-accent-orange"
                rotate="-rotate-6"
              />
            </div>
            <div className="feature-item opacity-0">
              <FeatureBlob
                title="เร็วกว่าเน็ตบ้าน"
                desc="อัพโหลดรูปแสนใบ หรือค้นหาหน้าเป็นหมื่น ก็ประมวลผลเสร็จในพริบตาเดียว"
                icon={<IconSparkles className="w-10 h-10" />}
                colorClass="bg-accent-pink"
                rotate="rotate-3"
              />
            </div>
            <div className="feature-item opacity-0">
              <FeatureBlob
                title="สิทธิส่วนบุคคลยืนหนึ่ง"
                desc="รูปเซลฟี่ค้นหาคุณจะไม่ถูกเก็บไว้ เราลบทันทีหลังจากทำภารกิจส่งรูปให้คุณเสร็จ!"
                icon={<IconSmile className="w-10 h-10" />}
                colorClass="bg-accent-yellow text-orange-600"
                rotate="-rotate-3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───── Footer CTA ───── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto bubbly-card bg-white p-12 text-center relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-accent-yellow/50 rounded-full blur-2xl" />
          <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-accent-pink/50 rounded-full blur-2xl" />

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-8 flex items-center justify-center gap-3">
              พร้อมจะลุยกันแล้วหรือยังแกรร! <IconArrowRight className="w-10 h-10 sm:w-12 sm:h-12 text-accent-orange" />
            </h2>
            <Link href="/signup" className="inline-flex items-center justify-center btn-primary text-xl px-12 py-5 shadow-[0_10px_0_#cc5500]">
              ไปหน้าสมัครสมาชิกกันเลย
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="mt-auto py-10 text-center border-t-4 border-white bg-slate-50/50 backdrop-blur-sm z-10 relative">
        <p className="text-slate-500 font-bold">© 2026 Find Dae Technologies. สร้างด้วย 💖 และวัยรุ่นหลังปวด</p>
      </footer>

    </div>
  );
}
