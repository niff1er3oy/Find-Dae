import path from 'path';
import { createHash } from 'crypto';
import { mkdir, readdir, rm, rename, stat, utimes } from 'fs/promises';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { ZipArchive } from 'archiver';
import { DOWNLOAD_TMP_DIR } from './uploadDirs';

// ระบบดาวโหลดรวมแบบ 2 จังหวะ: /prepare สั่งสร้าง zip ลงดิสก์เบื้องหลัง -> client poll /status
// จนพร้อม -> เบราว์เซอร์โหลดไฟล์สำเร็จรูปจาก /file เอง เหตุผลที่ไม่ stream zip ใส่ response ตรงๆ:
// ไฟล์ระดับหลาย GB ทำให้ client ต้องอมทั้งก้อนไว้ใน RAM ของแท็บ (มือถือ crash) และ resume ไม่ได้
// พอเป็นไฟล์นิ่งบนดิสก์ เบราว์เซอร์ใช้ download manager ของตัวเองได้เต็มที่ (สตรีมลงดิสก์/โชว์ %/
// resume ผ่าน Range) และการสร้างไฟล์ไม่ผูกกับ connection ของใคร ปิดแท็บระหว่างรอได้

export type DownloadJobState = {
  status: 'building' | 'ready' | 'error';
  processed: number;
  total: number;
  error?: string;
};

// เก็บสถานะ job ไว้บน globalThis — โมดูลนี้ถูก import จากหลาย route ซึ่ง bundler อาจสร้าง
// instance แยกกัน และตอน dev HMR ก็ evaluate โมดูลใหม่ได้ ใช้ globalThis กัน Map หลุดจากกัน
const g = globalThis as unknown as { __downloadJobs?: Map<string, DownloadJobState> };
const jobs = (g.__downloadJobs ??= new Map<string, DownloadJobState>());

// เก็บ zip ไว้ 24 ชม. — งานเดียวกันมีหลายคนกดโหลด ชุด photoIds เดียวกัน hash ตรงกันใช้ไฟล์ร่วมกันได้
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

// jobId ผูกกับเนื้อหาที่ขอ (event + ชุดรูป) ไม่ใช่ผูกกับผู้ใช้ เพื่อให้ dedup ข้ามผู้ใช้ได้
export function computeJobId(eventId: string, photoIds: number[]): string {
  const key = `${eventId}:${[...photoIds].sort((a, b) => a - b).join(',')}`;
  return createHash('sha256').update(key).digest('hex').slice(0, 40);
}

// กัน path traversal — jobId ถูกใช้ประกอบชื่อไฟล์ ต้องเป็น hex ล้วนเท่านั้น
export function isValidJobId(jobId: string): boolean {
  return /^[a-f0-9]{40}$/.test(jobId);
}

export function zipPathFor(jobId: string): string {
  return path.join(DOWNLOAD_TMP_DIR, `${jobId}.zip`);
}

export function getJobState(jobId: string): DownloadJobState | undefined {
  return jobs.get(jobId);
}

// touch mtime กัน cleanup ลบไฟล์ตัดหน้าระหว่างที่มีคนกำลังจะโหลด/กำลังโหลดอยู่
export async function markZipUsed(zipPath: string): Promise<void> {
  const now = new Date();
  await utimes(zipPath, now, now).catch(() => {});
}

export async function cleanupOldZips(): Promise<void> {
  try {
    const names = await readdir(DOWNLOAD_TMP_DIR);
    const now = Date.now();
    for (const name of names) {
      const p = path.join(DOWNLOAD_TMP_DIR, name);
      const s = await stat(p).catch(() => null);
      if (s && now - s.mtimeMs > MAX_AGE_MS) {
        await rm(p, { force: true }).catch(() => {});
      }
    }
  } catch {
    // โฟลเดอร์ยังไม่เคยถูกสร้าง — ไม่มีอะไรให้ลบ
  }
}

export function startZipBuild(jobId: string, filePaths: string[]): void {
  const existing = jobs.get(jobId);
  if (existing && existing.status === 'building') return; // มีคนสั่งสร้างชุดเดียวกันค้างอยู่แล้ว

  const state: DownloadJobState = { status: 'building', processed: 0, total: filePaths.length };
  jobs.set(jobId, state);
  void buildZip(jobId, filePaths, state);
}

async function buildZip(jobId: string, filePaths: string[], state: DownloadJobState): Promise<void> {
  const zipPath = zipPathFor(jobId);
  // เขียนลง .part ก่อนแล้วค่อย rename ตอนเสร็จ — การมีอยู่ของไฟล์ .zip คือสัญญาณ "พร้อมโหลด"
  // ที่รอดข้าม server restart ได้ (สถานะใน memory หายแต่ไฟล์ยังอยู่)
  const partPath = `${zipPath}.part`;
  try {
    await mkdir(DOWNLOAD_TMP_DIR, { recursive: true });

    // store mode (ไม่บีบอัด) — รูปเป็น .jpg/.webp ที่บีบอัดมาแล้ว บีบซ้ำเปลืองแรงแทบไม่ลดขนาด
    const archive = new ZipArchive({ store: true });
    const out = createWriteStream(partPath);
    const finished = new Promise<void>((resolve, reject) => {
      out.on('close', resolve);
      out.on('error', reject);
      archive.on('error', reject);
    });
    archive.on('entry', () => { state.processed += 1; });
    archive.on('warning', (err) => console.error(`Zip build warning (job ${jobId}):`, err));
    archive.pipe(out);

    for (const filePath of filePaths) {
      archive.file(filePath, { name: path.basename(filePath) });
    }
    await archive.finalize();
    await finished;

    await rename(partPath, zipPath);
    state.status = 'ready';
  } catch (err) {
    console.error(`Zip build failed (job ${jobId}):`, err);
    state.status = 'error';
    state.error = 'สร้างไฟล์ zip ไม่สำเร็จ';
    rm(partPath, { force: true }).catch(() => {});
  }
}

// bridge Node stream -> Web ReadableStream เอง แทน Readable.toWeb() ซึ่งมี race condition:
// ถ้า client ยกเลิกดาวโหลดกลางทาง controller ฝั่ง web ปิดไปแล้วแต่ source ยัง push ต่อ กลายเป็น
// "Invalid state: Controller is already closed" uncaughtException ที่ทำ Node process ล่มทั้งตัว
export function nodeStreamToWebStream(stream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on('data', (chunk: Buffer) => {
        try {
          controller.enqueue(new Uint8Array(chunk));
          if ((controller.desiredSize ?? 1) <= 0) stream.pause();
        } catch {
          // controller ปิดไปแล้ว (client ยกเลิกกลางทาง) — เลิกอ่านต่อ
          stream.destroy();
        }
      });
      stream.on('end', () => {
        try { controller.close(); } catch { /* client ปิดการเชื่อมต่อไปก่อนแล้ว */ }
      });
      stream.on('error', (err) => {
        console.error('Download stream error:', err);
        try { controller.error(err); } catch { /* client ปิดการเชื่อมต่อไปก่อนแล้ว */ }
      });
    },
    pull() {
      stream.resume();
    },
    cancel() {
      stream.destroy();
    },
  });
}
