'use client';

import { useState } from "react";
import { createPortal } from "react-dom";
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

      {aiReport && typeof document !== 'undefined' && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative animate-pop-in border-[6px] border-accent-peach">
             <div className="absolute -top-6 -right-6 bg-white p-3 rounded-full border-4 border-slate-100 shadow-xl hidden sm:block"><Bot className="w-10 h-10 text-accent-orange" /></div>
             <h4 className="text-2xl font-black text-accent-orange mb-4 flex items-center gap-3">
                <Bot className="w-8 h-8 sm:hidden" />
                รายงานความสำเร็จจากการค้นหา (Report)
             </h4>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
               <pre className="bg-slate-50 p-5 rounded-2xl text-sm md:text-base overflow-x-auto whitespace-pre-wrap font-mono text-slate-600 border-2 border-slate-100/50 shadow-inner">
                 {aiReport}
               </pre>
             </div>
             <button 
                onClick={() => setAiReport('')} 
                className="mt-6 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-200 rounded-full font-black text-lg transition-all active:scale-95 w-full flex items-center justify-center gap-2"
             >
                รับทราบและปิดรายงาน
             </button>
           </div>
         </div>,
         document.body
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
