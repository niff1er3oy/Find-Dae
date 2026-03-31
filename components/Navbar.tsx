'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { animate, stagger } from "animejs";
import { getUserAction, logoutAction } from "@/app/actions/auth";
import { usePathname } from "next/navigation";

export function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
export function IconMenu({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
export function IconClose({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: number, name: string, role: string, profile: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    getUserAction().then(res => {
      setUser(res || null);
    });
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      animate('.mobile-menu', { opacity: [0, 1], translateY: [-20, 0], duration: 300, ease: 'outQuad' });
      animate('.mobile-links > *', { opacity: [0, 1], translateY: [20, 0], delay: stagger(50), duration: 400, ease: 'outBack' });
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logoutAction();
    setUser(null);
    setIsMenuOpen(false);
    window.location.href = '/'; // เด้งกลับหน้าแรกและเคลียร์ state ใหม่หมด
  };

  return (
    <>
      <div className="fixed top-4 inset-x-4 sm:inset-x-6 flex justify-center z-50 pointer-events-none">
        <nav className="w-full max-w-5xl bg-white/90 backdrop-blur-xl border-4 border-white pointer-events-auto rounded-full shadow-[0_10px_30px_rgba(255,140,66,0.1)] px-6 py-3 flex items-center justify-between transition-all hover:shadow-[0_15px_40px_rgba(255,140,66,0.15)]">
          <Link
            href="/"
            className="flex items-center gap-2 group"
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
            <Link href="/#roles" className="hover:text-accent-orange transition-colors">เว็บนี้คืออะไร?</Link>
            <Link href="/#features-section" className="hover:text-accent-pink transition-colors">ข้อดี</Link>
            <Link href="/#how-it-works" className="hover:text-accent-yellow transition-colors">ทำยังไง?</Link>
            <Link href="/events" className="hover:text-accent-orange transition-colors">อีเวนต์</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 bg-white pr-2 pl-1.5 py-1.5 rounded-full shadow-[0_4px_0_#f1f5f9] border-2 border-slate-100">
                <Link href="/dashboard" className="rounded-full overflow-hidden border-2 border-accent-orange/50 hover:border-accent-pink transition-colors">
                  <img
                    src={user.profile ? (user.profile.startsWith('/') ? user.profile : `/api/image/${user.profile}`) : '/default-profile.png'}
                    alt="Profile"
                    className="w-10 h-10 object-cover"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2.5 rounded-full font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                  เข้าสู่ระบบ
                </Link>
                <Link href="/signup" className="flex items-center justify-center bg-accent-orange text-white px-6 py-2.5 rounded-full font-bold shadow-[0_4px_0_#cc5500] hover:-translate-y-1 hover:shadow-[0_6px_0_#cc5500] active:translate-y-1 active:shadow-[0_0px_0_#cc5500] transition-all">
                  สมัครเลย!
                </Link>
              </>
            )}
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
          <div className="mobile-links flex flex-col gap-6 text-2xl font-extrabold text-center my-auto py-12">

            <Link href="/#roles" onClick={() => setIsMenuOpen(false)} className="text-slate-800 hover:text-accent-orange">เว็บนี้คืออะไร?</Link>
            <Link href="/#features-section" onClick={() => setIsMenuOpen(false)} className="text-slate-800 hover:text-accent-pink">ข้อดี</Link>
            <Link href="/#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-slate-800 hover:text-accent-yellow">ทำยังไง?</Link>
            <Link href="/events" onClick={() => setIsMenuOpen(false)} className="text-slate-800 hover:text-accent-orange">อีเวนต์</Link>

            <div className="h-2 w-16 bg-accent-peach rounded-full mx-auto my-4 shrink-0" />

            {user ? (
              <div className="flex flex-col items-center gap-2">
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="rounded-full overflow-hidden border-4 border-accent-orange shadow-md mb-2 hover:border-accent-pink transition-colors">
                  <img
                    src={user.profile ? (user.profile.startsWith('/') ? user.profile : `/api/image/${user.profile}`) : '/default-profile.png'}
                    alt="Profile"
                    className="w-24 h-24 object-cover"
                  />
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-4 px-8 py-3 rounded-full font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-xl w-full max-w-xs border-2 border-red-200"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-2xl text-slate-500 hover:text-accent-orange transition-colors">เข้าสู่ระบบ</Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center bg-accent-orange text-white py-4 rounded-full shadow-[0_6px_0_#cc5500] w-full max-w-xs mx-auto active:translate-y-2 active:shadow-none transition-all text-xl shrink-0">
                  สมัครสมาชิกเลย!
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
