'use client';

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { uploadMultiplePhotosAction, callAIForReportAction, getAIProgressAction, checkAiServerAction } from "@/app/actions/photo";
import { useRouter } from "next/navigation";
import { Camera, Bot, AlertTriangle } from "lucide-react";

export default function UploadButtonClient({ eventId }: { eventId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isWaitingReport, setIsWaitingReport] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [progressText, setProgressText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg("");

    // Check initial constraints before sending to server
    if (files.length > 500) {
      setErrorMsg("กรุณาเลือกไม่เกิน 500 รูปต่อครั้งครับ");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    const oversizedFiles = Array.from(files).filter(f => f.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      setErrorMsg(`พบรูปที่ขนาดเกิน 5MB จำนวน ${oversizedFiles.length} รูป กรุณาลบออกก่อนอัปโหลด`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    setProgressText(`ตรวจสอบสถานะ AI Server...`);

    const isAiUp = await checkAiServerAction();
    if (!isAiUp) {
      setErrorMsg("AI Server ไม่ตอบสนอง หรือยังไม่ได้เปิดระบบ กรุณาเปิดระบบ AI ก่อนกดอัปโหลดครับ");
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i]);
    }

    try {
      setProgressText(`กำลังวิ่งส่งข้อมูลเข้าเซิร์ฟเวอร์...`);
      const res = await uploadMultiplePhotosAction(eventId, formData);

      if (res.success) {
        // เมื่ออัปเดตไฟล์ลงเครื่องเสร็จ เปลี่ยนสถานะมารอรีพอร์ต
        setIsWaitingReport(true);
        setProgressText(`กำลังให้ AI สแกนใบหน้าและรอรีพอร์ต...`);

        try {
          const aiRes = await callAIForReportAction(eventId, res.folder_path!);
          if (aiRes.success) {
            // AI รับงานแล้ว ประมวลผลอยู่เบื้องหลัง — poll ความคืบหน้าเป็นระยะ
            let finalMessage = "";
            let pollError = "";
            const maxAttempts = 200; // ~200 * 1.5s = 5 นาที กันวน poll ไม่รู้จบ

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
              await new Promise((resolve) => setTimeout(resolve, 1500));
              const progRes = await getAIProgressAction(eventId);

              if (!progRes.success || !progRes.progress) {
                pollError = progRes.error || "ไม่พบสถานะความคืบหน้า";
                break;
              }

              const { status, message } = progRes.progress;
              setProgressText(message || "กำลังประมวลผล...");

              if (status === "done") {
                finalMessage = message;
                break;
              }
              if (status === "error") {
                pollError = message || "เกิดข้อผิดพลาดระหว่างประมวลผล";
                break;
              }
            }

            if (finalMessage) {
              setProgressText(`AI สแกนเสร็จสิ้น!`);
              setAiReport(finalMessage);
            } else if (pollError) {
              setErrorMsg("อัปโหลดสำเร็จ แต่ " + pollError);
            } else {
              setErrorMsg("อัปโหลดสำเร็จ แต่รอผล AI นานเกินไป กรุณาตรวจสอบภายหลัง");
            }
          } else {
            setErrorMsg("อัปโหลดสำเร็จ แต่ " + aiRes.error);
          }
        } catch (e) {
          setErrorMsg("การสแกนใบหน้าเชื่อมต่อไม่ได้ แต่ได้ส่งรูปลงงานแล้ว");
        }

        setTimeout(() => {
          setIsUploading(false);
          setIsWaitingReport(false);
          router.refresh();
        }, 3000);
      } else {
        setErrorMsg(res.error || "เกิดข้อผิดพลาดในการอัปโหลด");
        setIsUploading(false);
      }
    } catch (err) {
      setErrorMsg("เซิร์ฟเวอร์ไม่ตอบสนอง กรุณาลองใหม่น้า");
      setIsUploading(false);
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

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
              รายงานจาก AI (Report)
            </h4>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
              <pre className="bg-slate-50 p-5 rounded-2xl text-sm md:text-base overflow-x-auto whitespace-pre-wrap font-mono text-slate-600 border-2 border-slate-100 shadow-inner">
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

      {isUploading ? (
        <div className={`px-6 py-4 sm:px-8 sm:py-5 font-black text-base sm:text-xl rounded-full shadow-inner flex items-center justify-center gap-2 sm:gap-3 w-full cursor-not-allowed ${isWaitingReport ? 'bg-accent-peach text-white shadow-[0_4px_0_#e7a59a] animate-bounce' : 'bg-slate-200 text-slate-600 animate-pulse'}`}>
          <svg className={`w-6 h-6 sm:w-8 sm:h-8 animate-spin flex-shrink-0 ${isWaitingReport ? 'text-white' : 'text-accent-orange'}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="truncate">{progressText}</span>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-4 sm:px-8 sm:py-5 bg-accent-yellow text-amber-900 font-black text-lg sm:text-xl rounded-2xl sm:rounded-full shadow-[0_6px_0_#d97706] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all w-full flex justify-center items-center gap-3"
        >
          <span className="hidden sm:inline">อัปโหลดรูปลงงานนี้</span>
          <Camera className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
