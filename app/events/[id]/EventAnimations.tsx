'use client';

import { useEffect } from 'react';
import { animate, stagger, set } from 'animejs';

export default function EventAnimations() {
  useEffect(() => {
    // 1. ซ่อน Element เป้าหมาย
    set('.event-header-item', { opacity: 0, translateY: 20 });
    set('.photo-card-item', { opacity: 0, scale: 0.9, translateY: 20 });
    set('.collab-badge', { opacity: 0, scale: 0.8 });
    
    // 2. เด้งส่วนแบนเนอร์และข้อความอธิบายแบบทยอย
    animate('.event-header-item', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1000,
      delay: stagger(100),
      ease: 'spring(1, 80, 12, 0)'
    });

    // 3. เด้งรายชื่อตากล้อง (รัวๆ แบบยิงปืนกล)
    animate('.collab-badge', {
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 800,
      delay: stagger(50, { start: 400 }),
      ease: 'spring(1, 80, 12, 0)'
    });

    // 4. เด้งรูปภาพแบบกริด (ถ้ามี)
    animate('.photo-card-item', {
      opacity: [0, 1],
      scale: [0.9, 1],
      translateY: [20, 0],
      duration: 1000,
      delay: stagger(50, { start: 600 }),
      ease: 'spring(1, 80, 10, 0)'
    });

  }, []);

  return null;
}
