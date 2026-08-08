'use client';

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { uploadMultiplePhotosAction, callAIForReportAction, getAIProgressAction, checkAiServerAction } from "@/app/actions/photo";
import { useRouter } from "next/navigation";
import { Camera, Bot, AlertTriangle } from "lucide-react";

// แบ่งไฟล์เป็นชุดๆ ตามขนาดรวม (และจำนวนไฟล์) ไม่ให้ชุดไหนใหญ่/นานเกินจน
// connection ผ่าน Cloudflare Tunnel โดนตัดกลางทาง
function chunkFilesForUpload(files: File[], maxBytesPerChunk: number, maxFilesPerChunk: number): File[][] {
  const chunks: File[][] = [];
  let current: File[] = [];
  let currentBytes = 0;

  for (const file of files) {
    const wouldExceed = current.length > 0 && (currentBytes + file.size > maxBytesPerChunk || current.length >= maxFilesPerChunk);
    if (wouldExceed) {
      chunks.push(current);
      current = [];
      currentBytes = 0;
    }
    current.push(file);
    currentBytes += file.size;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

export default function UploadButtonClient({ eventId }: { eventId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isWaitingReport, setIsWaitingReport] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [progressText, setProgressText] = useState("");
  const [progressPercent, setProgressPercent] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSendingFilesRef = useRef(false);
  const router = useRouter();

  // เตือนก่อนปิด/ออกจากหน้า เฉพาะช่วงที่ไฟล์ยังส่งไม่ถึง server ครบ —
  // หลังจากนั้นงานฝั่ง server/AI ทำงานต่อได้เองแม้ปิดหน้าไปแล้ว ไม่ต้องเตือน
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isSendingFilesRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // Resume: ถ้าเข้าหน้านี้มาแล้วมีงาน index ค้างอยู่จากรอบก่อน (เช่นออกจากหน้าไปตอนกำลังรอ AI)
  // ให้ต่อแสดง progress หรือโชว์ผลลัพธ์ทันทีโดยไม่ต้องอัปโหลดใหม่
  useEffect(() => {
    (async () => {
      const progRes = await getAIProgressAction(eventId);
      if (!progRes.success || !progRes.progress) return;

      const { status, message, processed, total } = progRes.progress;
      if (status === "running" || status === "queued") {
        setIsUploading(true);
        setIsWaitingReport(true);
        setProgressText(message || "กำลังประมวลผล...");
        if (typeof total === "number" && total > 0) {
          setProgressPercent(Math.min(100, Math.round(((processed ?? 0) / total) * 100)));
        }
        pollForCompletion();
      } else if (status === "done") {
        setAiReport(message || "ประมวลผลเสร็จสิ้น");
      }
      // status === "error" ถือเป็นข้อมูลเก่า ไม่ต้องโชว์ตอนเพิ่งเข้าหน้า
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  // poll ความคืบหน้าเป็นระยะจนกว่าจะ done/error — เรียกได้ทั้งตอนเพิ่งอัปโหลด และตอน resume
  const pollForCompletion = async () => {
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

      const { status, message, processed, total } = progRes.progress;
      setProgressText(message || "กำลังประมวลผล...");
      if (typeof total === "number" && total > 0) {
        setProgressPercent(Math.min(100, Math.round(((processed ?? 0) / total) * 100)));
      }

      if (status === "done") {
        finalMessage = message;
        setProgressPercent(100);
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

    setTimeout(() => {
      setIsUploading(false);
      setIsWaitingReport(false);
      router.refresh();
    }, 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg("");
    setProgressPercent(null);

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

    // แบ่งส่งเป็นชุดย่อยแทนการยิงทุกรูปในคำขอเดียว — กัน timeout จาก Cloudflare Tunnel
    // (edge จะตัดการเชื่อมต่อที่ค้างนานเกิน ~100 วิ ซึ่งเน็ตอัปโหลดบ้านช้ากว่าดาวน์โหลดมาก
    // ยิ่งไฟล์รวมกันใหญ่/เยอะยิ่งเสี่ยงโดนตัดกลางทาง)
    const MAX_BATCH_BYTES = 8 * 1024 * 1024;
    const MAX_BATCH_FILES = 20;
    const batches = chunkFilesForUpload(Array.from(files), MAX_BATCH_BYTES, MAX_BATCH_FILES);

    setIsWaitingReport(true); // ตั้งแต่เริ่มส่งไฟล์เลย ให้ progress bar โชว์ตลอดทั้งสองช่วง
    let allUploadedFilenames: string[] = [];
    let folderPath: string | undefined;
    let uploadError = "";
    let failedBatchCount = 0;

    // กันชุดไหนค้างตลอดไป (เช่น มีรูปที่เป็นไฟล์คลาวด์ยังไม่ได้ดาวน์โหลดในเครื่อง — มือถือ
    // Android บางรุ่นจะค้างรอ OS ดาวน์โหลดไฟล์แบบไม่มี timeout เลย) — ตัด ๆ ไปแล้วลองชุดถัดไปต่อ
    // แทนที่จะค้างทั้งหมด (Cloudflare เองก็ตัดการเชื่อมต่อที่ราว ~100 วิอยู่แล้ว ตั้งไว้ต่ำกว่านั้นหน่อย)
    const BATCH_TIMEOUT_MS = 90 * 1000;

    isSendingFilesRef.current = true;
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      setProgressText(`กำลังอัปโหลดชุดที่ ${i + 1}/${batches.length} (${batch.length} รูป)...`);
      setProgressPercent(Math.round((i / batches.length) * 100));

      const batchFormData = new FormData();
      for (const file of batch) {
        batchFormData.append("photos", file);
      }

      try {
        const res = await Promise.race([
          uploadMultiplePhotosAction(eventId, batchFormData),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('อัปโหลดชุดนี้นานเกินไป')), BATCH_TIMEOUT_MS)
          ),
        ]);
        if (res.success) {
          allUploadedFilenames.push(...(res.uploadedFilenames || []));
          folderPath = res.folder_path;
        } else {
          uploadError = res.error || "เกิดข้อผิดพลาดในการอัปโหลด";
          failedBatchCount++;
        }
      } catch (err) {
        uploadError = "มีรูปที่อัปโหลดไม่สำเร็จภายในเวลาที่กำหนด (อาจเป็นรูปที่ยังไม่ได้ดาวน์โหลดลงเครื่อง เช่น รูป sync จาก Google Photos — ลองเปิดรูปในแอป Gallery ก่อนแล้วอัปโหลดใหม่)";
        failedBatchCount++;
      }
      // ไม่ break — ให้ลองชุดถัดไปต่อ เผื่อปัญหาอยู่แค่บางไฟล์ ไม่ใช่ทั้งหมด
    }
    isSendingFilesRef.current = false;

    setProgressPercent(100);
    // เคลียร์ input ทันทีที่ request ถึง server แล้ว (ไม่ต้องรอ AI) เผื่อเลือกไฟล์ชุดเดิมซ้ำในรอบถัดไป
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (allUploadedFilenames.length === 0) {
      setErrorMsg(uploadError || "เกิดข้อผิดพลาดในการอัปโหลด");
      setIsUploading(false);
      setIsWaitingReport(false);
      return;
    }

    const partialFailureNote = failedBatchCount > 0
      ? `มี ${failedBatchCount} ชุด (${uploadError}) ไม่สำเร็จ`
      : "";

    setProgressText(
      partialFailureNote
        ? `อัปโหลดได้ ${allUploadedFilenames.length} รูป (${partialFailureNote}) กำลังให้ AI สแกนใบหน้า...`
        : `กำลังให้ AI สแกนใบหน้าและรอรีพอร์ต...`
    );

    try {
      const aiRes = await callAIForReportAction(eventId, folderPath!, allUploadedFilenames);
      if (aiRes.success) {
        // AI รับงานแล้ว ประมวลผลอยู่เบื้องหลัง — poll ความคืบหน้าเป็นระยะ
        await pollForCompletion();
        if (partialFailureNote) {
          setErrorMsg(`${partialFailureNote} (กรุณาอัปโหลดรูปที่เหลือใหม่)`);
        }
        return; // pollForCompletion จัดการ isUploading/isWaitingReport/router.refresh ให้แล้ว
      } else {
        setErrorMsg((partialFailureNote ? `อัปโหลดได้บางส่วน (${partialFailureNote}) และ ` : "อัปโหลดสำเร็จ แต่ ") + aiRes.error);
      }
    } catch (e) {
      setErrorMsg("การสแกนใบหน้าเชื่อมต่อไม่ได้ แต่ได้ส่งรูปลงงานแล้ว");
    }

    setTimeout(() => {
      setIsUploading(false);
      setIsWaitingReport(false);
      router.refresh();
    }, 3000);
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
