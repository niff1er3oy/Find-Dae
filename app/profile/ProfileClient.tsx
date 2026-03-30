'use client';

import { useState, useTransition, useRef } from 'react';
import { updateProfilePhotosAction, updatePasswordAction } from '@/app/actions/profile';
import { logoutAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function ProfileClient({ profileData }: { profileData: any }) {
  const [isPending, startTransition] = useTransition();
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');
  
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const [previews, setPreviews] = useState({
    profile: profileData.profile,
    img_1: profileData.img_1,
    img_2: profileData.img_2,
    img_3: profileData.img_3,
  });

  const photoFormRef = useRef<HTMLFormElement>(null);
  const pwFormRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const handlePhotoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPhotoError('');
    setPhotoSuccess('');
    if (!photoFormRef.current) return;

    const formData = new FormData(photoFormRef.current);
    startTransition(async () => {
      const res = await updateProfilePhotosAction(formData);
      if (res.success) {
        setPhotoSuccess('อัปเดตรูปภาพเรียบร้อยแล้ว!');
        // รีโหลดหน้าหลังจากอัปเดตเพื่อแสดงรูปใหม่จาก Server
        setTimeout(() => router.refresh(), 1000);
      } else {
        setPhotoError(res.error || 'เกิดข้อผิดพลาดในการอัปโหลดรูป');
      }
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (!pwFormRef.current) return;

    const formData = new FormData(pwFormRef.current);
    startTransition(async () => {
      const res = await updatePasswordAction(formData);
      if (res.success) {
        setPwSuccess('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว!');
        pwFormRef.current?.reset();
      } else {
        setPwError(res.error || 'รหัสผ่านปัจจุบันไม่ถูกต้อง');
      }
    });
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = '/';
  };

  return (
    <div className="w-full flex justify-center pb-20 pt-8 z-10 relative">
       <div className="w-full max-w-4xl flex flex-col gap-10">
          
          {/* Header & Basic Info */}
          <div className="bubbly-card p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 border-t-[8px] border-t-accent-peach">
             <div className="relative group">
                <img 
                   src={previews.profile.startsWith('/') ? previews.profile : `/api/image/${profileData.profile}`} 
                   alt="Profile" 
                   className="w-40 h-40 rounded-full object-cover border-8 border-white shadow-xl" 
                />
             </div>

             <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-2">{profileData.name}</h1>
                <p className="text-xl text-slate-500 font-bold mb-4">{profileData.mail}</p>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <span className={`px-5 py-2 rounded-full font-black text-white shadow-md ${profileData.role === 'photographer' ? 'bg-accent-orange' : 'bg-accent-pink'}`}>
                    {profileData.role === 'photographer' ? '📸 ตากล้อง' : '👋 ผู้เข้าร่วมงาน'}
                  </span>
                  <button onClick={handleLogout} className="px-5 py-2 rounded-full font-bold bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors">
                    ออกจากระบบ
                  </button>
                </div>
             </div>
          </div>

          {/* Edit Photos Form */}
          <form ref={photoFormRef} onSubmit={handlePhotoSubmit} className="bubbly-card p-8 sm:p-12 border-l-[8px] border-l-accent-pink">
             <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
               จัดการรูปภาพ <span className="text-accent-pink">🖼️</span>
             </h2>

             {photoError && <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 font-bold border-2 border-red-200">{photoError}</div>}
             {photoSuccess && <div className="mb-6 p-4 rounded-2xl bg-green-50 text-green-600 font-bold border-2 border-green-200">{photoSuccess}</div>}

             <div className="mb-8">
               <label className="font-extrabold text-slate-700 text-lg mb-4 block">เปลี่ยนภาพโปรไฟล์ปัจจุบัน</label>
               <input type="file" name="profile" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} className="block w-full text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-accent-orange file:text-white hover:file:bg-orange-600 cursor-pointer" />
             </div>

             {profileData.role === 'attendee' && (
               <div className="mt-8 pt-8 border-t-4 border-slate-100">
                 <h3 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">ใบหน้าอ้างอิงของคุณ 🤳</h3>
                 <p className="text-slate-500 font-bold mb-6">รูปเหล่านี้จะถูกใช้โดยระบบ AI เพื่อให้คุณสามารถค้นหาตัวเองได้ในรูปภาพของงานอีเวนต์ กรุณาถ่ายให้เห็นหน้าชัดเจนที่สุด</p>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[1, 2, 3].map((num) => {
                      const key = `img_${num}` as keyof typeof previews;
                      const hasImage = !!profileData[key];
                      
                      return (
                        <div key={num} className="flex flex-col gap-3">
                          <label className="font-bold text-slate-600 text-center">รูปหน้าตรงมุมที่ {num}</label>
                          <div className="w-full h-48 bg-slate-100 border-4 border-dashed border-slate-300 hover:border-accent-pink/50 rounded-3xl overflow-hidden relative flex flex-col items-center justify-center group transition-colors">
                            {previews[key] && hasImage ? (
                              <img src={previews[key].startsWith('blob:') ? previews[key] : `/api/image/${previews[key]}`} alt={`Face ${num}`} className="w-full h-full object-cover" />
                            ) : previews[key] ? (
                              <img src={previews[key]} alt={`Preview ${num}`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center p-4">
                                 <div className="text-3xl mb-2">📸</div>
                                 <span className="text-slate-400 font-bold text-sm">ยังไม่อัปโหลด</span>
                              </div>
                            )}
                            <input type="file" name={`img_${num}`} accept="image/*" onChange={(e) => handleFileChange(e, key)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                               <span className="text-white font-bold bg-accent-pink px-4 py-2 rounded-full">อัปโหลดทับรูปเดิม</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                 </div>
               </div>
             )}

             <button type="submit" disabled={isPending} className="btn-pink mt-10 py-4 px-10 rounded-full font-black text-xl text-white w-full sm:w-auto flex items-center justify-center gap-2">
                {isPending ? 'กำลังอัปเดตข้อมูลให้...' : 'บันทึกรูปภาพใหม่'}
             </button>
          </form>

          {/* Change Password Form */}
          <form ref={pwFormRef} onSubmit={handlePasswordSubmit} className="bubbly-card p-8 sm:p-12 border-l-[8px] border-l-slate-400">
             <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
               เปลี่ยนรหัสผ่าน <span className="text-slate-400">🔒</span>
             </h2>

             {pwError && <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 font-bold border-2 border-red-200">{pwError}</div>}
             {pwSuccess && <div className="mb-6 p-4 rounded-2xl bg-green-50 text-green-600 font-bold border-2 border-green-200">{pwSuccess}</div>}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-slate-700 pl-2">รหัสผ่านปัจจุบัน</label>
                  <input type="password" name="currentPassword" required className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 outline-none focus:border-slate-400" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-slate-700 pl-2">รหัสผ่านใหม่</label>
                  <input type="password" name="newPassword" required className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 outline-none focus:border-slate-400" />
                </div>
             </div>
             
             <button type="submit" disabled={isPending} className="px-8 py-4 bg-slate-800 text-white font-black rounded-full shadow-[0_6px_0_#334155] hover:-translate-y-1 active:translate-y-2 active:shadow-none transition-all mt-8">
               บันทึกรหัสผ่าน
             </button>
          </form>

       </div>
    </div>
  )
}
