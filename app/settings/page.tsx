import { getFullProfileAction } from "@/app/actions/profile";
import { redirect } from 'next/navigation';
import ProfileClient from "./ProfileClient";
import { logoutAction } from "@/app/actions/auth";

export default async function ProfilePage() {
  const profileData = await getFullProfileAction();
  
  if (!profileData) {
    redirect('/login');
  }

  // เซิร์ฟเวอร์แอ็กชันเพื่อให้ปุ่มล็อกเอาต์ใน Client ใช้งานได้และรีไดเรกต์ไปหน้าแรก
  const handleServerLogout = async () => {
    'use server';
    await logoutAction();
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 flex flex-col pt-32 pb-12 px-6">
      
      {/* Playful Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="bg-bubble absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] bg-accent-peach/40 rounded-full blur-3xl animate-blob text-slate-800" />
        <div className="bg-bubble absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] bg-accent-yellow/30 rounded-full blur-3xl animate-blob text-slate-800" style={{ animationDelay: '2s' }} />
        <div className="bg-bubble absolute bottom-[-5%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] bg-accent-pink/30 rounded-full blur-3xl animate-blob text-slate-800" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col items-center">
        <ProfileClient profileData={profileData} />
      </div>
    </div>
  );
}
