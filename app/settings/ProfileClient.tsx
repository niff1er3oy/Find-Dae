'use client';

import { useState, useTransition, useRef } from 'react';
import { updateProfilePhotosAction, updatePasswordAction, updateNameAction } from '@/app/actions/profile';
import { useRouter } from 'next/navigation';
import { Camera, Lock, Smile, Image as ImageIcon, User, Pencil, Check, X, ShieldCheck } from 'lucide-react';

export default function ProfileClient({ profileData }: { profileData: any }) {
  const [isPending, startTransition] = useTransition();
  const [photoMsg, setPhotoMsg] = useState<{ type: 'ok' | 'err', text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err', text: string } | null>(null);
  const [nameMsg, setNameMsg] = useState<{ type: 'ok' | 'err', text: string } | null>(null);

  // Name edit state
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(profileData.name);

  const [previews, setPreviews] = useState({
    profile: profileData.profile,
    img_1: profileData.img_1,
    img_2: profileData.img_2,
    img_3: profileData.img_3,
  });

  const photoFormRef = useRef<HTMLFormElement>(null);
  const pwFormRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const isPhotographer = profileData.role === 'photographer';

  const profileSrc = previews.profile
    ? (previews.profile.startsWith('/') || previews.profile.startsWith('blob:') ? previews.profile : `/api/image/${previews.profile}`)
    : '/api/image/default-profile.png';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handlePhotoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPhotoMsg(null);
    if (!photoFormRef.current) return;
    const formData = new FormData(photoFormRef.current);
    startTransition(async () => {
      const res = await updateProfilePhotosAction(formData);
      setPhotoMsg(res.success ? { type: 'ok', text: 'อัปเดตรูปภาพเรียบร้อยแล้ว!' } : { type: 'err', text: res.error || 'เกิดข้อผิดพลาด' });
      if (res.success) setTimeout(() => router.refresh(), 800);
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwMsg(null);
    if (!pwFormRef.current) return;
    const formData = new FormData(pwFormRef.current);
    startTransition(async () => {
      const res = await updatePasswordAction(formData);
      setPwMsg(res.success ? { type: 'ok', text: 'เปลี่ยนรหัสผ่านเรียบร้อย!' } : { type: 'err', text: res.error || 'เกิดข้อผิดพลาด' });
      if (res.success) pwFormRef.current?.reset();
    });
  };

  const handleNameSave = () => {
    setNameMsg(null);
    const formData = new FormData();
    formData.append('name', nameValue);
    startTransition(async () => {
      const res = await updateNameAction(formData);
      setNameMsg(res.success ? { type: 'ok', text: 'เปลี่ยนชื่อเรียบร้อย!' } : { type: 'err', text: res.error || 'เกิดข้อผิดพลาด' });
      if (res.success) { setEditingName(false); router.refresh(); }
    });
  };

  return (
    <div className="w-full flex justify-center pb-20 pt-4 z-10 relative">
      <div className="w-full max-w-3xl flex flex-col gap-6">

        {/* ── Hero Card ── */}
        <div className="bubbly-card p-8 sm:p-10 relative overflow-hidden">
          {/* Decorative blob */}
          <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-15 ${isPhotographer ? 'bg-accent-orange' : 'bg-accent-pink'}`} />

          <div className="relative flex flex-col sm:flex-row items-center gap-7">
            {/* Avatar with upload overlay */}
            <div className="relative shrink-0 group">
              <img src={profileSrc} alt="รูปโปรไฟล์" className="w-32 h-32 rounded-full object-cover border-[6px] border-white shadow-xl" />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-7 h-7 text-white" />
                <form ref={photoFormRef} onSubmit={handlePhotoSubmit} className="hidden" />
                <input type="file" name="profile" accept="image/*" className="hidden"
                  onChange={(e) => { handleFileChange(e, 'profile'); photoFormRef.current?.requestSubmit(); }} />
              </label>
              {/* Role badge */}
              <div className={`absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow ${isPhotographer ? 'bg-accent-orange' : 'bg-accent-pink'}`}>
                {isPhotographer ? <Camera className="w-4 h-4 text-white" /> : <Smile className="w-4 h-4 text-white" />}
              </div>
            </div>

            {/* Name + info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              {/* Editable name */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                {editingName ? (
                  <>
                    <input
                      value={nameValue}
                      onChange={e => setNameValue(e.target.value)}
                      className="text-2xl font-black text-slate-800 border-b-4 border-accent-orange bg-transparent outline-none w-full max-w-xs"
                      aria-label="ชื่อผู้ใช้"
                      autoFocus
                    />
                    <button onClick={handleNameSave} disabled={isPending} aria-label="บันทึกชื่อ" className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow hover:bg-green-600 shrink-0">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setEditingName(false); setNameValue(profileData.name); }} aria-label="ยกเลิกแก้ไขชื่อ" className="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-300 shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-800 truncate">{nameValue}</h1>
                    <button onClick={() => setEditingName(true)} aria-label="แก้ไขชื่อ" className="w-8 h-8 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:bg-accent-orange/10 hover:text-accent-orange shrink-0 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              {nameMsg && (
                <p role={nameMsg.type === 'err' ? 'alert' : 'status'} className={`text-sm font-bold mb-1 ${nameMsg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{nameMsg.text}</p>
              )}

              <p className="text-slate-500 font-bold text-base mb-3">{profileData.mail}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className={`px-4 py-1.5 rounded-full font-black text-white text-sm shadow flex items-center gap-1.5 ${isPhotographer ? 'bg-accent-orange' : 'bg-accent-pink'}`}>
                  {isPhotographer ? <><Camera className="w-4 h-4" /> ตากล้อง</> : <><Smile className="w-4 h-4" /> ผู้เข้าร่วมงาน</>}
                </span>
              </div>
            </div>
          </div>

          {/* Quick tip */}
          <p className="mt-5 text-xs text-slate-500 font-semibold text-center sm:text-left border-t-2 border-slate-100 pt-4">
            💡 กดที่รูปโปรไฟล์เพื่อเปลี่ยนรูปได้เลย — กดปุ่มดินสอเพื่อแก้ชื่อ
          </p>
        </div>

        {/* ── Face Images (attendee only) ── */}
        {!isPhotographer && (
          <form ref={photoFormRef} onSubmit={handlePhotoSubmit} className="bubbly-card p-7 sm:p-10 border-t-[6px] border-t-accent-pink">
            <h2 className="text-2xl font-black text-slate-800 mb-1 flex items-center gap-3">
              <User className="w-6 h-6 text-accent-pink" /> รูปใบหน้าอ้างอิง
            </h2>
            <p className="text-slate-500 font-medium text-sm mb-6">ระบบ AI ใช้รูปเหล่านี้ค้นหาตัวคุณในงาน กรุณาถ่ายให้เห็นหน้าชัดเจน</p>

            {photoMsg && (
              <div role={photoMsg.type === 'err' ? 'alert' : 'status'} className={`mb-5 p-3 rounded-2xl font-bold text-sm border-2 ${photoMsg.type === 'ok' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{photoMsg.text}</div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map((num) => {
                const key = `img_${num}` as keyof typeof previews;
                const src = previews[key]
                  ? (previews[key].startsWith('blob:') ? previews[key] : `/api/image/${previews[key]}`)
                  : null;
                return (
                  <div key={num} className="flex flex-col gap-2">
                    <label className="font-bold text-slate-500 text-xs text-center">มุมที่ {num}</label>
                    <label className="relative w-full aspect-square bg-slate-100 border-4 border-dashed border-slate-200 hover:border-accent-pink/60 rounded-3xl overflow-hidden flex items-center justify-center group cursor-pointer transition-colors">
                      {src ? (
                        <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Camera className="w-7 h-7 text-slate-300" />
                          <span className="text-slate-500 font-bold text-xs">อัปโหลด</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold text-xs bg-accent-pink px-3 py-1 rounded-full">เปลี่ยนรูป</span>
                      </div>
                      <input type="file" name={`img_${num}`} accept="image/*" onChange={(e) => handleFileChange(e, key)} className="hidden" />
                    </label>
                  </div>
                );
              })}
            </div>

            <button type="submit" disabled={isPending} className="btn-primary btn-pink flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              {isPending ? 'กำลังบันทึก...' : 'บันทึกรูปภาพ'}
            </button>
          </form>
        )}

        {/* Profile photo form for photographer (separate) */}
        {isPhotographer && (
          <form ref={photoFormRef} onSubmit={handlePhotoSubmit} className="bubbly-card p-7 sm:p-10 border-t-[6px] border-t-accent-orange">
            <h2 className="text-2xl font-black text-slate-800 mb-5 flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-accent-orange" /> เปลี่ยนรูปโปรไฟล์
            </h2>

            {photoMsg && (
              <div role={photoMsg.type === 'err' ? 'alert' : 'status'} className={`mb-4 p-3 rounded-2xl font-bold text-sm border-2 ${photoMsg.type === 'ok' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{photoMsg.text}</div>
            )}

            <input type="file" name="profile" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')}
              className="block w-full text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:font-bold file:bg-accent-orange file:text-white hover:file:bg-orange-500 cursor-pointer mb-5" />

            <button type="submit" disabled={isPending} className="btn-primary py-3 px-8 rounded-full font-black flex items-center gap-2 text-base">
              {isPending ? 'กำลังบันทึก...' : 'บันทึกรูปโปรไฟล์'}
            </button>
          </form>
        )}

        {/* ── Change Password ── */}
        <form ref={pwFormRef} onSubmit={handlePasswordSubmit} className="bubbly-card p-7 sm:p-10">
          <h2 className="text-2xl font-black text-slate-800 mb-5 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-slate-400" /> เปลี่ยนรหัสผ่าน
          </h2>

          {pwMsg && (
            <div role={pwMsg.type === 'err' ? 'alert' : 'status'} className={`mb-4 p-3 rounded-2xl font-bold text-sm border-2 ${pwMsg.type === 'ok' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{pwMsg.text}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pw-current" className="font-extrabold text-slate-600 text-sm pl-1">รหัสผ่านปัจจุบัน</label>
              <input id="pw-current" type="password" name="currentPassword" required autoComplete="current-password" placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 outline-none focus:border-accent-orange focus:ring-4 focus:ring-accent-orange/20 transition-colors placeholder:text-slate-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pw-new" className="font-extrabold text-slate-600 text-sm pl-1">รหัสผ่านใหม่</label>
              <input id="pw-new" type="password" name="newPassword" required autoComplete="new-password" placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 outline-none focus:border-accent-orange focus:ring-4 focus:ring-accent-orange/20 transition-colors placeholder:text-slate-500" />
            </div>
          </div>

          <button type="submit" disabled={isPending}
            className="flex items-center gap-2 px-8 py-3 bg-slate-800 text-white font-black rounded-full shadow-[0_6px_0_#334155] hover:-translate-y-1 active:translate-y-2 active:shadow-none transition-all">
            <Lock className="w-4 h-4" />
            {isPending ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่าน'}
          </button>
        </form>

      </div>
    </div>
  );
}
