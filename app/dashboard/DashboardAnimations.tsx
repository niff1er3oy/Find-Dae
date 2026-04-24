'use client';

import { useEffect } from 'react';
import { animate, stagger, set, utils } from 'animejs';

export default function DashboardAnimations() {
  useEffect(() => {
    // 1. ซ่อน Element เป้าหมายทั้งหมดตั้งแต่ตอนโหลด
    set('.stagger-item', { opacity: 0, translateY: 30 });
    set('.hero-avatar', { scale: 0, rotate: -20, opacity: 0 });

    // 2. อนิเมชันเด้งของการ์ดทีละใบ
    animate('.stagger-item', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: stagger(100, { start: 100 }),
      ease: 'spring(1, 80, 12, 0)'
    });

    // 3. อนิเมชันรูปโปรไฟล์เด้งหมุน
    animate('.hero-avatar', {
      opacity: [0, 1],
      scale: [0, 1],
      rotate: [-20, 0],
      duration: 1200,
      ease: 'spring(1, 80, 10, 0)',
      delay: 200
    });

    // 4. บับเบิ้ลพื้นหลังขยับไปมา
    animate('.bg-bubble', {
      translateY: () => utils.random(-40, 40),
      translateX: () => utils.random(-40, 40),
      scale: () => utils.random(0.9, 1.1),
      duration: () => utils.random(4000, 8000),
      direction: 'alternate',
      loop: true,
      ease: 'easeInOutQuad'
    });

  }, []);

  return null; // ไม่แรนเดอร์หน้าจอแต่ทำงานเบื้องหลัง
}
