'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animationConfig?: any;
}

export default function ScrollReveal({ children, className = '', animationConfig = {} }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    // ซ่อน element ไว้ก่อนเริ่มการทำงาน
    ref.current.style.opacity = '0';
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(ref.current!, {
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 800,
            ease: 'spring(1, 80, 10, 0)',
            ...animationConfig
          });
          observer.unobserve(ref.current!);
        }
      });
    }, { threshold: 0.15 });
    
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [animationConfig]);

  return <div ref={ref} className={className}>{children}</div>;
}
