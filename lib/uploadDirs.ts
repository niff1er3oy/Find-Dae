import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/home/niff1er/Documents/find_dae_photos'; // Default path if not set in .env

export const MEMBER_UPLOAD_DIR = path.join(UPLOAD_DIR, 'member');
export const EVENTS_UPLOAD_DIR = path.join(UPLOAD_DIR, 'events');
