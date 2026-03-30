"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { animate, stagger, utils } from "animejs";
import { registerAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

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
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();
  const [previews, setPreviews] = useState({ profile: '', img_1: '', img_2: '', img_3: '' });
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [key]: url }));
    } else {
      setPreviews(prev => ({ ...prev, [key]: '' }));
    }
  };

  useEffect(() => {
    // Float and Bounce background blobs (continuous)
    animate('.bg-bubble', {
      translateY: () => utils.random(-40, 40),
      translateX: () => utils.random(-40, 40),
      scale: () => utils.random(0.9, 1.1),
      duration: () => utils.random(4000, 8000),
      direction: 'alternate',
      loop: true,
      ease: 'inOutQuad'
    });

    // Playful Form Entry Animation
    animate('.form-element', {
      opacity: [0, 1],
      translateY: [40, 0],
      rotate: [utils.random(-3, 3), 0],
      duration: 1000,
      delay: stagger(100),
      ease: 'spring(1, 80, 12, 0)'
    });
  }, []);

  const handleSubmit = (formData: FormData) => {
    formData.append('role', role);
    setErrorMsg('');
    startTransition(async () => {
      const res = await registerAction(formData);
      if (res.success) {
        router.push('/login?registered=true');
      } else {
        setErrorMsg(res.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
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

      {/* Signup Form Container */}
      <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-4">
        <div className="bubbly-card w-full max-w-lg p-8 sm:p-12 relative my-10 border-t-[8px] border-accent-pink">
          
          <div className="form-element text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 flex items-center justify-center gap-3">
              สร้างบัญชีผู้ใช้ใหม่ <IconSparkles className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400" />
            </h1>
            <p className="text-slate-500 font-bold">มาร่วมสนุกกับประสบการณ์หารูปที่ไม่เหมือนใคร!</p>
          </div>

          <form className="flex flex-col gap-5" action={handleSubmit}>
            
            {/* Role Selection */}
            <div className="form-element flex flex-col gap-3">
              <label className="font-extrabold text-slate-700">คุณเข้าใช้งานในฐานะอะไร?</label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Attendee Option */}
                <label className="relative cursor-pointer" onClick={() => setRole('attendee')}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="attendee" 
                    readOnly
                    checked={role === 'attendee'}
                    className="peer sr-only" 
                  />
                  <div className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-4 transition-all duration-300 ${role === 'attendee' ? 'border-accent-pink bg-pink-50 shadow-[0_4px_0_#f472b6] -translate-y-1' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'}`}>
                    <IconSmile className={`w-8 h-8 ${role === 'attendee' ? 'text-accent-pink' : 'text-slate-300'}`} />
                    <span className={`font-bold text-sm sm:text-base ${role === 'attendee' ? 'text-slate-800' : ''}`}>ฉันมาหารูป</span>
                  </div>
                </label>

                {/* Photographer Option */}
                <label className="relative cursor-pointer" onClick={() => setRole('photographer')}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="photographer" 
                    readOnly
                    checked={role === 'photographer'}
                    className="peer sr-only" 
                  />
                  <div className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-4 transition-all duration-300 ${role === 'photographer' ? 'border-accent-orange bg-orange-50 shadow-[0_4px_0_#fb923c] -translate-y-1' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'}`}>
                    <IconCamera className={`w-8 h-8 ${role === 'photographer' ? 'text-accent-orange' : 'text-slate-300'}`} />
                    <span className={`font-bold text-sm sm:text-base ${role === 'photographer' ? 'text-slate-800' : ''}`}>ฉันเป็นตากล้อง</span>
                  </div>
                </label>

              </div>
            </div>

            <div className="h-0.5 w-full bg-slate-100 rounded-full my-1 form-element" />

            {errorMsg && (
              <div className="form-element bg-red-50 border-2 border-red-300 text-red-600 font-bold px-4 py-3 rounded-2xl text-center">
                {errorMsg}
              </div>
            )}

            {/* General Inputs */}
            <div className="form-element flex flex-col gap-2">
              <label className="font-extrabold text-slate-700 pl-2">ชื่อ - นามสกุล</label>
              <input 
                type="text" 
                name="name"
                required
                placeholder="เช่น สมหมาย ใจดี" 
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="form-element flex flex-col gap-2">
              <label className="font-extrabold text-slate-700 pl-2">อีเมล</label>
              <input 
                type="email" 
                name="mail"
                required
                placeholder="sommai@example.com" 
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="form-element flex flex-col gap-2">
              <label className="font-extrabold text-slate-700 pl-2">รหัสผ่าน</label>
              <input 
                type="password" 
                name="password"
                required
                placeholder="อย่างน้อย 8 ตัวอักษร" 
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="form-element flex flex-col gap-2">
              <label className="font-extrabold text-slate-700 pl-2">รูปโปรไฟล์ (ไม่บังคับ)</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="shrink-0 flex justify-center sm:justify-start">
                  {previews.profile ? (
                    <img src={previews.profile} alt="Preview" className="w-20 h-20 rounded-full object-cover border-4 border-accent-orange shadow-md animate-pop-in" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center text-slate-400">
                      <IconSmile className="w-10 h-10 opacity-50" />
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  name="profile"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'profile')}
                  className="w-full px-3 py-3 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-orange focus:outline-none focus:ring-4 focus:ring-accent-orange/20 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-accent-orange file:text-white hover:file:bg-orange-600 file:cursor-pointer file:transition-colors"
                />
              </div>
            </div>

            {/* Conditional Face Images for Attendee */}
            {/* Conditional Face Images for Attendee */}
            <div className={`form-element mt-2 p-5 bg-pink-50 border-4 border-accent-pink/30 rounded-3xl flex-col gap-4 transition-all duration-300 ${role === 'attendee' ? 'flex' : 'hidden'}`}>
              <div className="flex items-center gap-2">
                <IconSmile className="w-6 h-6 text-accent-pink" />
                <span className="font-black text-slate-800 text-lg">สแกนใบหน้าของคุณ (บังคับ)</span>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-2">อัปโหลดรูปเซลฟี่ใบหน้าตัวเอง 3 รูป ให้ AI เรียนรู้จักคุณ!</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => {
                  const key = `img_${num}` as keyof typeof previews;
                  return (
                    <div key={num} className="flex flex-col gap-3 bg-white p-3 rounded-2xl border-2 border-slate-100 shadow-sm">
                      <div className="w-full h-32 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center relative border-2 border-dashed border-slate-200">
                        {previews[key] ? (
                          <img src={previews[key]} alt={`Face ${num}`} className="w-full h-full object-cover animate-pop-in" />
                        ) : (
                          <div className="text-slate-400 flex flex-col items-center">
                            <IconCamera className="w-8 h-8 opacity-40 mb-1" />
                            <span className="text-xs font-bold px-4 text-center">อัปโหลดหน้าที่ {num}</span>
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        name={key} 
                        accept="image/*" 
                        required={role === 'attendee'} 
                        disabled={role !== 'attendee'} 
                        onChange={(e) => handleFileChange(e, key)}
                        className="block w-full text-xs text-slate-500 file:w-full file:mr-0 file:py-2 file:px-3 file:rounded-xl file:border-0 file:font-bold file:bg-accent-pink file:text-white hover:file:bg-pink-500 file:cursor-pointer transition-colors cursor-pointer text-center" 
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={isPending} className="form-element flex items-center justify-center gap-2 btn-primary w-full text-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
              {isPending ? 'กำลังพามุดเข้าสู่ระบบ...' : 'สมัคสมาชิกลุยเลย!'} <IconArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
