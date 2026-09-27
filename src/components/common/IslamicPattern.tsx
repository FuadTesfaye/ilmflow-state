'use client';

import React from 'react';

/**
 * Architectural Eight-Pointed Geometric Seal (Girih / Khatam)
 * Clean, balanced vector suitable for modern enterprise badges and emblems.
 */
export const IslamicStarIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'text-[#064e3b]',
  size = 18
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`inline-block shrink-0 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="5.5" y="5.5" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
    <rect
      x="5.5"
      y="5.5"
      width="13"
      height="13"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.25"
      transform="rotate(45 12 12)"
    />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Pure Calligraphic Inscription (Bismillah)
 * Rendered with clean typographic proportion and no cheesy borders.
 */
export const BismillahEmblem: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`text-center select-none py-1 ${className}`}>
    <span
      className="font-arabic text-xl sm:text-2xl text-[#064e3b] font-normal tracking-normal"
      dir="rtl"
    >
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </span>
  </div>
);

/**
 * Minimal Academic Hairline Divider
 */
export const IslamicDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 py-4 select-none ${className}`}>
    <div className="h-[1px] flex-1 bg-[#e7e2d6]" />
    <IslamicStarIcon size={12} className="text-[#9e782f]" />
    <div className="h-[1px] flex-1 bg-[#e7e2d6]" />
  </div>
);

/**
 * Subtle Archival Border Corner
 */
export const OrnateCorner: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br'; className?: string }> = ({
  position,
  className = 'text-[#e7e2d6]'
}) => {
  const rotation = {
    tl: 'rotate-0',
    tr: 'rotate-90',
    br: 'rotate-180',
    bl: '-rotate-90'
  }[position];

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`${rotation} ${className} pointer-events-none select-none`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1H8M1 1V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
};
