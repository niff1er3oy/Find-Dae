'use client';


import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateEventAction, addEventCollaboratorAction, removeEventCollaboratorAction } from "@/app/actions/event";
import Link from 'next/link';
import { Key, RefreshCw, Trash2, Save, Image as ImageIcon, User, AlertCircle, ArrowLeft, Edit2, Users, UserPlus, Shield, Settings, Camera, ScanFace, CheckCircle2, Crown } from 'lucide-react';
import { animate, stagger, set } from 'animejs';
import DeleteEventButtonClient from "@/app/events/[id]/DeleteEventButtonClient";

export default function ManageEventClient({ event, attendees, collaborators = [], myRole, stats }: { event: any, attendees: any[], collaborators?: any[], myRole?: string, stats?: { total_photos: number, total_faces: number, matched_faces: number } }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [preview, setPreview] = useState<string | null>(event.poster ? `/api/event-image/${event.poster}` : null);
  const [password, setPassword] = useState(event.password ? String(event.password) : '');
  const [collabEmail, setCollabEmail] = useState('');
  const [collabRole, setCollabRole] = useState('photographer');
  const [collabList, setCollabList] = useState(collaborators);
  const [isCollabPending, startCollabTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const collabRoleRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    set('.manage-stagger-item', { opacity: 0, translateY: 30 });

    animate('.manage-stagger-item', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: stagger(100),
      ease: 'spring(1, 80, 12, 0)'
    });
  }, []);

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
        return;
      }
      setErrorMsg('');
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(event.poster ? `/api/event-image/${event.poster}` : null);
    }
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setErrorMsg('');
    const formData = new FormData(formRef.current);

    startTransition(async () => {
      const res = await updateEventAction(event.id.toString(), formData);
      if (res.success) {
        router.refresh();
        alert('บันทึกข้อมูลเรียบร้อยแล้ว! 🎉');
      } else {
        setErrorMsg(res.error || 'เกิดข้อผิดพลาดในการอัปเดตอีเวนต์');
      }
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 flex flex-col pt-28 sm:pt-32 pb-16 px-4 sm:px-6">

      {/* Playful Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="bg-bubble absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] bg-sky-200/40 rounded-full blur-3xl animate-blob text-slate-800" />
        <div className="bg-bubble absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] bg-accent-yellow/30 rounded-full blur-3xl animate-blob text-slate-800" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col gap-10">

        {/* Header */}
        <div className="manage-stagger-item bubbly-card overflow-hidden">
          {/* Gradient accent bar */}
          <div className="h-2.5 bg-gradient-to-r from-accent-orange via-accent-yellow to-accent-peach" />

          <div className="p-5 sm:p-7">
            {/* Top row: back button + delete */}
            <div className="flex items-center justify-between mb-5">
              <Link
                href={`/events/${event.id}`}
                className="inline-flex items-center gap-2 text-accent-orange hover:text-orange-700 font-black text-sm bg-orange-50 hover:bg-orange-100 px-4 py-2.5 rounded-full transition-all border-2 border-orange-100 hover:border-orange-200 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">กลับไปหน้าอีเวนต์</span>
                <span className="sm:hidden">กลับ</span>
              </Link>

              <DeleteEventButtonClient eventId={event.id.toString()} />
            </div>

            {/* Main info row */}
            <div className="flex items-center gap-4">
              {/* Poster */}
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-md shrink-0">
                {event.poster ? (
                  <img src={`/api/event-image/${event.poster}`} alt={event.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-orange/20 to-accent-yellow/20">
                    <Edit2 className="w-6 h-6 text-accent-orange/60" />
                  </div>
                )}
              </div>

              {/* Name + badges */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black bg-accent-orange/10 text-accent-orange px-2.5 py-0.5 rounded-full border border-accent-orange/20">
                    <Settings className="w-3 h-3" /> จัดการ
                  </span>
                  {myRole && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full">
                      {myRole === 'main_owner' ? <><Crown className="w-3 h-3 text-amber-500" /> Main Owner</> : myRole === 'owner' ? <><Shield className="w-3 h-3 text-indigo-400" /> Owner</> : <><Camera className="w-3 h-3" /> Photographer</>}
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-slate-800 break-words leading-tight truncate">
                  {event.name}
                </h1>
              </div>
            </div>

            {/* Stats row */}
            {stats && (
              <div className="grid grid-cols-3 gap-3 mt-5 pt-6">
                <div className="flex flex-col items-center text-center rounded-2xl p-3 border-2" style={{ backgroundColor: '#000000ff', borderColor: '#000000ff' }}>
                  <span className="text-2xl sm:text-3xl font-black text-white">{stats.total_photos.toLocaleString()}</span>
                  <span className="text-[10px] sm:text-sm font-bold text-white mt-1 flex items-center gap-1">
                    <Camera className="w-3 h-3" /> <span className="hidden sm:inline">รูปทั้งหมด</span>
                  </span>
                </div>
                <div className="flex flex-col items-center text-center rounded-2xl p-3 border-2" style={{ backgroundColor: '#ff8c42', borderColor: '#ff8c42' }}>
                  <span className="text-2xl sm:text-3xl font-black text-white">{stats.total_faces.toLocaleString()}</span>
                  <span className="text-[10px] sm:text-sm font-bold text-white mt-1 flex items-center gap-1">
                    <ScanFace className="w-3 h-3" /> <span className="hidden sm:inline">หน้าที่ตรวจพบ</span>
                  </span>
                </div>
                <div className="flex flex-col items-center text-center rounded-2xl p-3 border-2" style={{ backgroundColor: '#f472b6', borderColor: '#f472b6' }}>
                  <span className="text-2xl sm:text-3xl font-black text-white">{stats.matched_faces.toLocaleString()}</span>
                  <span className="text-[10px] sm:text-sm font-bold text-white mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> <span className="hidden sm:inline">จับคู่แล้ว</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 1: Attendees Analytics */}
        <div className="manage-stagger-item bubbly-card p-8 border-t-[8px] border-t-accent-yellow shadow-md">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-6">
            <div className="bg-yellow-100 p-2 rounded-xl">
              <User className="w-7 h-7 text-amber-500" />
            </div>
            สถิติคนหารูปเจอ ({attendees.length} คน)
          </h2>

          {attendees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {attendees.map((att: any) => (
                <div key={att.id} className="flex flex-col gap-3 p-4 bg-white border-[3px] border-slate-100 rounded-[20px] hover:border-accent-yellow hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-4">
                    <img
                      src={att.profile ? (att.profile.startsWith('/') ? att.profile : `/api/image/${att.profile}`) : '/api/image/default-profile.png'}
                      alt={att.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-slate-50 shrink-0 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-slate-800 truncate text-lg leading-tight mb-2">{att.name}</p>
                      <p className="text-sm font-black text-accent-pink bg-pink-50 inline-block px-3 py-1 rounded-full border border-pink-100 shadow-sm">ได้รูป {att.matched_faces} ภาพ</p>
                    </div>
                  </div>

                  {/* แสดงรูปภาพที่หาเจอ */}
                  {att.matched_photos && att.matched_photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar pt-2 border-t-2 border-slate-50">
                      {att.matched_photos.map((photo: string, idx: number) => (
                        <div key={idx} className="w-[60px] h-[60px] shrink-0 rounded-xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm transition-transform hover:scale-110 origin-left">
                          <img
                            src={`/api/event-photo/${event.id}/${photo}`}
                            alt={`Matched photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-[28px] border-2 border-dashed border-slate-300">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold text-xl mb-2">ยังไม่มีใครค้นหารูปเจอเลย 🥺</p>
              <p className="text-slate-400 font-medium">รอผู้เข้าร่วมงานอัปโหลดหน้ามาหาดูก่อนนะ</p>
            </div>
          )}
        </div>

        {/* Section 2: Edit Event Form */}
        <div className="manage-stagger-item bubbly-card p-8 border-t-[8px] border-t-accent-pink shadow-md">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-6">
            <div className="bg-pink-100 p-2 rounded-xl">
              <Edit2 className="w-7 h-7 text-accent-pink" />
            </div>
            แก้ไขข้อมูลอีเวนต์
          </h2>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-600 font-bold flex items-center justify-center animate-bounce-short gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form ref={formRef} onSubmit={handleUpdate} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-extrabold text-slate-700 pl-2 text-lg">ชื่ออีเวนต์</label>
              <input type="text" name="name" defaultValue={event.name} required className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-pink focus:outline-none focus:ring-4 focus:ring-accent-pink/20 transition-all text-lg" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-extrabold text-slate-700 pl-2 text-lg">รายละเอียดงาน</label>
              <textarea name="detail" defaultValue={event.detail} required rows={4} className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-pink focus:outline-none focus:ring-4 focus:ring-accent-pink/20 transition-all text-lg resize-none"></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between pl-2">
                <label className="font-extrabold text-slate-700 text-lg flex items-center gap-2">
                  <Key className="w-5 h-5 text-accent-pink" />
                  รหัสผ่านเข้าดูอีเวนต์ (ตัวเลือก)
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ปล่อยว่างไว้หากต้องการให้เป็นงานสาธารณะ..."
                  className="w-full sm:flex-1 px-5 py-4 rounded-2xl border-4 border-slate-100 bg-white font-bold text-slate-800 focus:border-accent-pink focus:outline-none focus:ring-4 focus:ring-accent-pink/20 transition-all text-lg tracking-wider"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRandomPassword}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-accent-orange/10 text-orange-600 font-bold rounded-2xl border-b-[4px] border-orange-200 hover:bg-accent-orange/20 hover:border-orange-300 hover:translate-y-[-2px] transition-all whitespace-nowrap active:translate-y-[2px] active:border-b-0"
                  >
                    <RefreshCw className="w-5 h-5" /> สุ่มตัวเลขใหม่
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassword('')}
                    disabled={!password}
                    className="flex items-center justify-center px-5 py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-200 hover:border-red-200"
                    title="ลบรหัสผ่าน (ปลดล็อกงาน)"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm font-bold pl-2 mt-1">หากมีรหัสผ่าน ระบบจะบังคับให้ทุกคนกรอกก่อนเสมอ (ยกเว้นตากล้อง)</p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="font-extrabold text-slate-700 pl-2 text-lg">รูปโปสเตอร์ปกงาน</label>

              <div className="w-full h-80 bg-slate-50 border-4 border-dashed border-slate-200 hover:border-accent-pink/50 transition-colors rounded-[32px] overflow-hidden relative flex flex-col items-center justify-center group cursor-pointer shadow-inner">
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover animate-pop-in" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-white/90 text-slate-800 font-black px-6 py-3 rounded-full flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" /> อัปโหลดใหม่เพื่อเปลี่ยน
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 font-bold flex flex-col items-center">
                    <ImageIcon className="w-16 h-16 mb-4 opacity-30 group-hover:scale-110 group-hover:text-accent-pink transition-all duration-300" />
                    <span className="text-lg">คลิกเพื่ออัปโหลดแนบโปสเตอร์ปกใหม่</span>
                  </div>
                )}
                <input type="file" name="poster" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <p className="text-slate-400 text-sm font-bold pl-2 mt-1">ไฟล์ใหม่จะถูกเซฟทับไฟล์เดิมทันที (ขนาดไม่เกิน 10MB)</p>
            </div>

            <div className="pt-8 border-t-4 border-slate-100 mt-2">
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary btn-pink w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                <Save className="w-7 h-7" /> {isPending ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการแก้ไขทั้งหมด'}
              </button>
            </div>
          </form>
        </div>

        {/* Section 3: Manage Collaborators */}
        {(myRole === 'main_owner' || myRole === 'owner') && (
          <div className="bubbly-card p-8 border-t-[8px] border-t-indigo-400 shadow-md">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 p-2 rounded-xl">
                <Users className="w-7 h-7 text-indigo-500" />
              </div>
              จัดการผู้ดูแลร่วม (Co-Managers)
            </h2>

            <div className="bg-slate-50 p-4 sm:p-6 rounded-[24px] border-2 border-slate-100 mb-8">
              <h3 className="font-extrabold text-slate-700 text-lg mb-4 flex items-center gap-2"><UserPlus className="w-5 h-5" /> เพิ่มตากล้องร่วมงาน</h3>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="อีเมลตากล้องเป้าหมาย..."
                  value={collabEmail}
                  onChange={(e) => setCollabEmail(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-xl border-4 border-white bg-white font-bold text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none transition-all"
                />
                <div className="flex gap-3">
                  <select
                    value={collabRole}
                    onChange={(e) => setCollabRole(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-4 rounded-xl border-4 border-white bg-white font-bold text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none cursor-pointer text-sm sm:text-base"
                  >
                    <option value="owner">Owner</option>
                    <option value="photographer">Photographer</option>
                  </select>
                  <button
                    type="button"
                    disabled={isCollabPending || !collabEmail}
                    onClick={() => {
                      startCollabTransition(async () => {
                        const res = await addEventCollaboratorAction(event.id.toString(), collabEmail, collabRole);
                        if (res.success) {
                          alert('✅ เพิ่มผู้ดูแลร่วมสำเร็จ!');
                          setCollabEmail('');
                          setCollabList([res.collaborator, ...collabList]);
                          router.refresh();
                        } else {
                          alert(res.error);
                        }
                      });
                    }}
                    className="shrink-0 px-4 sm:px-5 py-4 bg-indigo-500 text-white font-black rounded-xl shadow-[0_4px_0_#4338ca] hover:-translate-y-1 hover:shadow-[0_6px_0_#4338ca] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm sm:text-base"
                  >
                    {isCollabPending ? 'กำลังเพิ่ม...' : 'เชิญ'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 p-4 bg-white border-[3px] border-amber-200 bg-amber-50 rounded-2xl relative overflow-hidden">
                <div className="absolute right-[-20px] opacity-10"><Shield className="w-24 h-24" /></div>
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-slate-200 flex items-center justify-center">
                  <span className="text-xl font-black text-slate-400">👑</span>
                </div>
                <div className="flex-1 min-w-0 relative z-10">
                  <p className="font-extrabold text-slate-800 text-lg flex items-center gap-2"> ผู้สร้างงาน (Main Owner) <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full uppercase tracking-wider">HOST</span></p>
                  <p className="text-slate-500 text-sm font-bold truncate">แอดมินสูงสุดของงาน และเจ้าของพื้นที่นี้</p>
                </div>
              </div>

              {collabList.map((c: any) => (
                <div key={c.id || c.member_id} className="flex items-center gap-4 p-4 bg-white border-[3px] border-slate-100 rounded-2xl hover:border-slate-200 transition-colors">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-slate-100 bg-slate-50">
                    <img src={c.profile ? (c.profile.startsWith('/') ? c.profile : `/api/image/${c.profile}`) : '/api/image/default-profile.png'} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                      {c.name}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider text-white ${c.role === 'owner' ? 'bg-indigo-500' : 'bg-teal-500'}`}>
                        {c.role}
                      </span>
                    </p>
                    <p className="text-slate-500 text-sm font-bold truncate">{c.mail}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`ยืนยันการลบ ${c.name} ออกจากการเป็นผู้ดูแลร่วม?`)) {
                        startCollabTransition(async () => {
                          const res = await removeEventCollaboratorAction(event.id.toString(), c.member_id.toString());
                          if (res.success) {
                            setCollabList(collabList.filter((item: any) => item.member_id !== c.member_id));
                          } else {
                            alert(res.error);
                          }
                        });
                      }
                    }}
                    disabled={isCollabPending}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                    title="ลบออกจากงาน"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
