'use client';

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { checkAiServerAction, callAISearchAction, getAISearchProgressAction } from "@/app/actions/photo";
import { useRouter } from "next/navigation";
import { AlertTriangle, Bot, Search } from "lucide-react";

export default function SearchButtonClient({ eventId }: { eventId: string }) {
  const [isSearching, setIsSearching] = useState(false);
  const [isWaitingReport, setIsWaitingReport] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [progressText, setProgressText] = useState("");
  const [progressPercent, setProgressPercent] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Resume: ถ้าเข้าหน้านี้มาแล้วมีงานค้นหาค้างอยู่จากรอบก่อน (เช่นออกจากหน้าไปตอนกำลังรอ AI)
  // ให้ต่อแสดง progress หรือโชว์ผลลัพธ์ทันทีโดยไม่ต้องกดค้นหาใหม่
  useEffect(() => {
    (async () => {
      const progRes = await getAISearchProgressAction(eventId);
      if (!progRes.success || !progRes.progress) return;

      const { status, message, processed, total } = progRes.progress;
      if (status === "running" || status === "queued") {
        setIsSearching(true);
        setIsWaitingReport(true);
        setProgressText(message || "กำลังค้นหา...");
        if (typeof total === "number" && total > 0) {
          setProgressPercent(Math.min(100, Math.round(((processed ?? 0) / total) * 100)));
        }
        pollForCompletion();
      } else if (status === "done") {
        setAiReport(message || "ค้นหาเสร็จสิ้น");
      }
      // status === "error" ถือเป็นข้อมูลเก่า ไม่ต้องโชว์ตอนเพิ่งเข้าหน้า
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  // poll ความคืบหน้าเป็นระยะจนกว่าจะ done/error — เรียกได้ทั้งตอนเพิ่งค้นหา และตอน resume
  const pollForCompletion = async () => {
    let finalMessage = "";
    let pollError = "";
    const maxAttempts = 80; // ~80 * 1.5s = 2 นาที กันวน poll ไม่รู้จบ

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const progRes = await getAISearchProgressAction(eventId);

      if (!progRes.success || !progRes.progress) {
        pollError = progRes.error || "ไม่พบสถานะความคืบหน้า";
        break;
      }

      const { status, message, processed, total } = progRes.progress;
      setProgressText(message || "กำลังค้นหา...");
      if (typeof total === "number" && total > 0) {
        setProgressPercent(Math.min(100, Math.round(((processed ?? 0) / total) * 100)));
      }

      if (status === "done") {
        finalMessage = message;
        setProgressPercent(100);
        break;
      }
      if (status === "error") {
        pollError = message || "เกิดข้อผิดพลาดระหว่างค้นหา";
        break;
      }
    }

    if (finalMessage) {
      setProgressText(`AI ค้นหาเสร็จสิ้น!`);
      setAiReport(finalMessage);
    } else if (pollError) {
      setErrorMsg("ข้อผิดพลาดจาก AI: " + pollError);
    } else {
      setErrorMsg("รอผล AI นานเกินไป กรุณาลองใหม่ภายหลัง");
    }

    setTimeout(() => {
      setIsSearching(false);
      setIsWaitingReport(false);
      router.refresh(); // สะกิดให้หน้าเว็บเฟรชข้อมูล ดึงแกลเลอรีรูปล่าสุดมาโชว์
    }, 3000);
  };

  const handleSearchClick = async () => {
    setErrorMsg("");
    setAiReport("");
    setProgressPercent(null);
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
         // AI รับงานแล้ว ค้นหาอยู่เบื้องหลัง — poll ความคืบหน้าเป็นระยะ
         await pollForCompletion();
         return; // pollForCompletion จัดการ isSearching/isWaitingReport/router.refresh ให้แล้ว
       } else {
         setErrorMsg("ข้อผิดพลาดจาก AI: " + aiRes.error);
       }
    } catch(e) {
         setErrorMsg("การเชื่อมต่อสแกนใบหน้าขาดหายไป");
    }

    setTimeout(() => {
      setIsSearching(false);
      setIsWaitingReport(false);
      router.refresh();
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
        <div className={`px-6 py-4 sm:px-8 sm:py-5 rounded-full shadow-inner flex flex-col items-center justify-center gap-2 w-full cursor-not-allowed ${isWaitingReport ? 'bg-accent-peach text-white shadow-[0_4px_0_#e7a59a]' : 'bg-slate-200 text-slate-600 animate-pulse'}`}>
          <div className="flex items-center justify-center gap-2 sm:gap-3 w-full font-black text-base sm:text-xl">
            <svg className={`w-6 h-6 sm:w-8 sm:h-8 animate-spin flex-shrink-0 ${isWaitingReport ? 'text-white' : 'text-accent-orange'}`} fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="truncate">{progressText}</span>
          </div>
          {isWaitingReport && progressPercent !== null && (
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleSearchClick}
          className="btn-primary btn-pink w-full flex items-center justify-center gap-3"
        >
          หารูป <Search className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
