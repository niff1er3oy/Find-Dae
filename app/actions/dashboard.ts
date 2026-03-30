'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { getUserAction } from './auth';

export async function getPhotographerStatsAction() {
   const user = await getUserAction();
   if (!user || user.role !== 'photographer') return { totalPhotos: 0, totalEvents: 0 };

   try {
     // ดึงยอดรวมรูปภาพทั้งหมดที่ตากล้องคนนี้เป็นคนอัปโหลด
     const [photoCountRows] = await pool.query<RowDataPacket[]>(
       'SELECT COUNT(id) as totalPhotos FROM photos WHERE cameraman_id = ?',
       [user.id]
     );

     // ดึงยอดรวม "งานอีเวนต์" ที่ตากล้องคนนี้เคยอัปโหลดรูปลงไป
     const [eventCountRows] = await pool.query<RowDataPacket[]>(
       'SELECT COUNT(DISTINCT event_id) as totalEvents FROM photos WHERE cameraman_id = ?',
       [user.id]
     );

     return {
       totalPhotos: photoCountRows[0].totalPhotos || 0,
       totalEvents: eventCountRows[0].totalEvents || 0
     };
   } catch(e) {
     console.error('Error fetching dashboard stats:', e);
     return { totalPhotos: 0, totalEvents: 0 };
   }
}

export async function getContributedEventsAction() {
   const user = await getUserAction();
   if (!user || user.role !== 'photographer') return [];

   try {
     // ดึงข้อมูลอีเวนต์ที่ช่างภาพคนนี้มีส่วนร่วมอัปโหลดภาพ (พร้อมนับจำนวนรูปที่ตัวเองฝากไว้ในแต่ละงาน)
     const [events] = await pool.query<RowDataPacket[]>(`
       SELECT e.*, COUNT(p.id) as my_photo_count
       FROM events e
       JOIN photos p ON e.id = p.event_id
       WHERE p.cameraman_id = ?
       GROUP BY e.id
       ORDER BY MAX(p.id) DESC
     `, [user.id]);
     
     return events;
   } catch(e) {
     console.error('Error fetching contributed events:', e);
     return [];
   }
}
