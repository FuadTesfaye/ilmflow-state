'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const RouteProgressBar: React.FC = () => {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // When pathname changes, trigger a quick, elegant progress animation
    setVisible(true);
    setProgress(35);

    const timer1 = setTimeout(() => {
      setProgress(80);
    }, 80);

    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 180);

    const timer3 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2.5px] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#135B3E] via-[#10b981] to-[#9E782F] shadow-[0_0_8px_rgba(19,91,62,0.6)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0
        }}
      />
    </div>
  );
};
