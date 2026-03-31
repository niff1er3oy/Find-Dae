'use client';

import { useState } from "react";
import { checkAiServerAction, callAISearchAction } from "@/app/actions/photo";
import { useRouter } from "next/navigation";
import { AlertTriangle, Bot, Search } from "lucide-react";

export default function SearchButtonClient({ eventId }: { eventId: string }) {
  const [isSearching, setIsSearching] = useState(false);
  const [isWaitingReport, setIsWaitingReport] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [progressText, setProgressText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSearchClick = async () => {
    setErrorMsg("");
    setAiReport("");
    setIsSearching(true);
    setProgressText(`ตรวจสอบหน้าด่าน AI Server...`);

    // เคาะประตูเช็กเซิร์ฟเวอร์ก่อน
    const isAiUp = await checkAiServerAction();
    if (!isAiUp) {
      setErrorMsg("AI Server ไม่ตอบสนอง หรือยังไม่ได้เปิดระบบ กรุณาเปิดระบบ AI ก่อนกดค้นหาครับ");
      setIsSearching(false);
      return;
    }

    setIsWaitingReport(true);
    setProgressText(`กำลังให้ AI สแกนใบหน้าและค้นหารูปของคุณ...`);

    try {
       const aiRes = await callAISearchAction(eventId);
       if (aiRes.success) {
         setProgressText(`AI ค้นหาเสร็จสิ้น!`);
         setAiReport(aiRes.report || "ค้นหาเสร็จสิ้น (AI ไม่ดรอปรีพอร์ตกลับมา)");
       } else {
         setErrorMsg("ข้อผิดพลาดจาก AI: " + aiRes.error);
       }
    } catch(e) {
         setErrorMsg("การเชื่อมต่อสแกนใบหน้าขาดหายไป");
    }

    setTimeout(() => {
      setIsSearching(false);
      setIsWaitingReport(false);
      router.refresh(); // สะกิดให้หน้าเว็บเฟรชข้อมูล ดึงแกลเลอรีรูปล่าสุดมาโชว์
    }, 3000);
  };

  return (
    <div className="w-full">
      {errorMsg && (
         <div className="mb-4 p-4 rounded-xl bg-red-100 text-red-600 font-bold border-2 border-red-200 animate-pulse flex items-center gap-2">
           <AlertTriangle className="w-6 h-6" /> {errorMsg}
         </div>
      )}

      {aiReport && (
         <div className="mb-6 p-6 rounded-2xl bg-white text-slate-700 font-bold border-4 border-accent-peach shadow-xl relative animate-float-soft">
           <div className="absolute -top-5 -right-5 bg-white p-2 border-2 border-slate-100 rounded-full shadow-md"><Bot className="w-8 h-8 text-accent-orange" /></div>
           <h4 className="text-xl font-black text-accent-orange mb-2">รายงานความสำเร็จจากการค้นหา (Report):</h4>
           <pre className="bg-slate-50 p-4 rounded-xl text-sm overflow-x-auto whitespace-pre-wrap font-mono text-slate-600 border-2 border-slate-100">
             {aiReport}
           </pre>
           <button onClick={() => setAiReport('')} className="mt-4 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full font-bold transition-colors w-full">ปิดรายงาน</button>
         </div>
      )}

      {isSearching ? (
        <div className={`px-8 py-5 font-black text-xl rounded-full shadow-inner flex items-center justify-center gap-3 w-full cursor-not-allowed ${isWaitingReport ? 'bg-accent-peach text-white shadow-[0_4px_0_#e7a59a] animate-bounce' : 'bg-slate-200 text-slate-600 animate-pulse'}`}>
          <svg className={`w-8 h-8 animate-spin ${isWaitingReport ? 'text-white' : 'text-accent-orange'}`} fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {progressText}
        </div>
      ) : (
        <button 
          onClick={handleSearchClick}
          className="px-8 py-5 bg-accent-pink text-white font-black text-xl rounded-full shadow-[0_6px_0_#db2777] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all w-full flex items-center justify-center gap-3"
        >
          หารูป <Search className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
