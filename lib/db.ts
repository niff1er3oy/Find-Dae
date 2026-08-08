import mysql from 'mysql2/promise';

const POOL_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
} as const;

let pool: mysql.Pool;

if (process.env.NODE_ENV === 'production') {
  pool = mysql.createPool(POOL_CONFIG);
} else {
  if (!(global as any)._mysqlPool) {
    (global as any)._mysqlPool = mysql.createPool(POOL_CONFIG);
  }
  pool = (global as any)._mysqlPool;
}

// ป้องกัน query ค้างรอ connection จาก pool แบบไม่มีวันจบ (เช่น connection รั่ว/หมด pool)
// ของเดิมไม่มี timeout เลย ทำให้ request ค้างเป็น "Pending" ตลอดไปฝั่ง client โดยไม่มี error ให้จับ
// wrap ตรงนี้ที่เดียวเพราะทุกที่เรียกผ่าน pool.query(...) อยู่แล้ว ไม่ต้องแก้ทีละไฟล์
const QUERY_TIMEOUT_MS = 15000;
const originalQuery = pool.query.bind(pool);
pool.query = ((...args: Parameters<typeof originalQuery>) => {
  return Promise.race([
    originalQuery(...args),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Database query timed out after ${QUERY_TIMEOUT_MS / 1000}s`)), QUERY_TIMEOUT_MS)
    ),
  ]);
}) as typeof pool.query;

export default pool;
