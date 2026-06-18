"use client";

import { useEffect, useState, useTransition, Suspense } from "react";
import { animate, stagger, utils } from "animejs";
import { loginAction } from "@/app/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";

/* ─── Fun Rounded Icons ─── */
function IconArrowLeft({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
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

function LoginContent() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    animate(".bg-bubble", {
      translateY: () => utils.random(-40, 40),
      translateX: () => utils.random(-40, 40),
      scale: () => utils.random(0.9, 1.1),
      duration: () => utils.random(4000, 8000),
      direction: "alternate",
      loop: true,
      ease: "inOutQuad"
    });
    animate(".form-element", {
      opacity: [0, 1],
      translateY: [40, 0],
      rotate: [utils.random(-3, 3), 0],
      duration: 1000,
      delay: stagger(100),
      ease: "spring(1, 80, 12, 0)"
    });
  }, []);

  const handleSubmit = (formData: FormData) => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await loginAction(formData);
      if (res.success) {
        // Redirect somewhere after login
        router.push("/events"); 
      } else {
        setErrorMsg(res.error || "เข้าสู่ระบบไม่สำเร็จ");
      }
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 flex flex-col">
      {/* Playful Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="bg-bubble absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] bg-accent-peach/40 rounded-full blur-3xl animate-blob" />
        <div className="bg-bubble absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] bg-accent-yellow/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="bg-bubble absolute bottom-[-5%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] bg-accent-pink/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navbar สืบทอดมาจาก Layout.tsx */}

      {/* Login Form Container */}
      <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-4">
        <div className="bubbly-card w-full max-w-md p-8 sm:p-12 relative border-t-[8px] border-t-accent-orange">
          
          <div className="form-element text-center mb-8 mt-2">
            <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center justify-center gap-3">
              ยินดีต้อนรับกลับมา! <IconUserRound className="w-8 h-8 text-accent-orange" />
            </h1>
            <p className="text-slate-500 font-bold">ล็อกอินเข้าสู่ระบบค้นหารูปสุดล้ำของคุณ</p>
          </div>

          <form className="flex flex-col gap-6" action={handleSubmit}>
            
            {registered && (
              <div role="status" className="form-element bg-green-50 border-2 border-green-300 text-green-700 font-bold px-4 py-3 rounded-2xl text-center">
                สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ
              </div>
            )}

            {errorMsg && (
              <div role="alert" className="form-element bg-red-50 border-2 border-red-300 text-red-600 font-bold px-4 py-3 rounded-2xl text-center">
                {errorMsg}
              </div>
            )}

            <div className="form-element flex flex-col gap-2">
              <label htmlFor="login-mail" className="font-extrabold text-slate-700 pl-2">อีเมล</label>
              <input
                id="login-mail"
                type="email"
                name="mail"
                required
                autoComplete="email"
                placeholder="sommai@example.com"
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="form-element flex flex-col gap-2 relative">
              <label htmlFor="login-password" className="font-extrabold text-slate-700 pl-2">รหัสผ่าน</label>
              <input
                id="login-password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="กรอกรหัสผ่านของคุณ"
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all placeholder:text-slate-500"
              />
            </div>

            <button type="submit" disabled={isPending} className="form-element btn-primary w-full text-xl mt-6 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isPending ? 'กำลังพุ่งทะยาน...' : 'ลงชื่อเข้าใช้'} <IconArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
            
          </form>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-2xl text-accent-orange">กำลังโหลด...</div>}>
      <LoginContent />
    </Suspense>
  );
}
