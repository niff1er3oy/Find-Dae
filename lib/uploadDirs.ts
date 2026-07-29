import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'D:\\find_dae_photos';

export const MEMBER_UPLOAD_DIR = path.join(UPLOAD_DIR, 'member');
export const EVENTS_UPLOAD_DIR = path.join(UPLOAD_DIR, 'events');
