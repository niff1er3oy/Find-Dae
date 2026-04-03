'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { getUserAction } from './auth';

export async function getPhotographerStatsAction() {
   const user = await getUserAction();
   if (!user || user.role !== 'photographer') return { totalPhotos: 0, totalEvents: 0 };

   try {
     const [photoCountRows] = await pool.query<RowDataPacket[]>(
       'SELECT COUNT(id) as totalPhotos FROM photos WHERE photographer_id = ?',
       [user.id]
     );
     const [eventCountRows] = await pool.query<RowDataPacket[]>(
       'SELECT COUNT(DISTINCT e.id) as totalEvents FROM events e LEFT JOIN event_collaborators ec ON e.id = ec.event_id WHERE e.photographer_id = ? OR ec.photographer_id = ?',
       [user.id, user.id]
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
       SELECT e.*, 
              (SELECT COUNT(*) FROM photos p WHERE p.event_id = e.id AND p.photographer_id = ?) as my_photo_count
       FROM events e
       LEFT JOIN event_collaborators ec ON e.id = ec.event_id
       WHERE e.photographer_id = ? OR ec.photographer_id = ?
       GROUP BY e.id
       ORDER BY e.created_at DESC
     `, [user.id, user.id, user.id]);
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
       'SELECT COUNT(DISTINCT f.photos_id) as totalPhotosFound FROM face f JOIN photos p ON f.photos_id = p.id WHERE f.attendee_id = ?',
       [user.id]
     );
     const [eventRows] = await pool.query<RowDataPacket[]>(
       'SELECT COUNT(DISTINCT p.event_id) as totalEventsSearched FROM face f JOIN photos p ON f.photos_id = p.id WHERE f.attendee_id = ?',
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
       WHERE f.attendee_id = ?
       GROUP BY e.id
       ORDER BY e.id DESC
     `, [user.id]);
     return events;
   } catch(e) {
     console.error('Error fetching attendee events:', e);
     return [];
   }
}
