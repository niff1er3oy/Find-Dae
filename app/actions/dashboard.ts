'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { getUserAction } from './auth';

export async function getPhotographerStatsAction() {
   const user = await getUserAction();
   if (!user || user.role !== 'photographer') return { totalPhotos: 0, totalEvents: 0 };

   try {
     const [photoCountRows] = await pool.query<RowDataPacket[]>(
       'SELECT COUNT(id) as totalPhotos FROM photos WHERE cameraman_id = ?',
       [user.id]
     );
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

export async function getAttendeeStatsAction() {
   const user = await getUserAction();
   if (!user || user.role !== 'attendee') return { totalPhotosFound: 0, totalEventsSearched: 0 };

   try {
     const [photoRows] = await pool.query<RowDataPacket[]>(
       'SELECT COUNT(DISTINCT f.photos_id) as totalPhotosFound FROM face f JOIN photos p ON f.photos_id = p.id WHERE f.member_id = ?',
       [user.id]
     );
     const [eventRows] = await pool.query<RowDataPacket[]>(
       'SELECT COUNT(DISTINCT p.event_id) as totalEventsSearched FROM face f JOIN photos p ON f.photos_id = p.id WHERE f.member_id = ?',
       [user.id]
     );
     return {
       totalPhotosFound: photoRows[0]?.totalPhotosFound || 0,
       totalEventsSearched: eventRows[0]?.totalEventsSearched || 0
     };
   } catch(e) {
     console.error('Error fetching attendee stats:', e);
     return { totalPhotosFound: 0, totalEventsSearched: 0 };
   }
}

export async function getAttendeeEventsAction() {
   const user = await getUserAction();
   if (!user || user.role !== 'attendee') return [];

   try {
     const [events] = await pool.query<RowDataPacket[]>(`
       SELECT e.*, COUNT(DISTINCT f.photos_id) as my_photo_count
       FROM events e
       JOIN photos p ON e.id = p.event_id
       JOIN face f ON f.photos_id = p.id
       WHERE f.member_id = ?
       GROUP BY e.id
       ORDER BY e.id DESC
     `, [user.id]);
     return events;
   } catch(e) {
     console.error('Error fetching attendee events:', e);
     return [];
   }
}
