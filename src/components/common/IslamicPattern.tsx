'use client';

import React from 'react';

/**
 * 8-Pointed Islamic Star Emblem (Hejrat Foundation / Masjid Al-Nabi Logo Icon)
 */
export const IslamicStarEmblem: React.FC<{ className?: string; size?: number }> = ({
  className = 'text-emerald-700',
  size = 32
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    {/* Outer 8-point star formed by two overlapping rounded squares */}
    <rect
      x="8"
      y="8"
      width="24"
      height="24"
      rx="3"
      stroke="currentColor"
      strokeWidth="2.2"
      fill="currentColor"
      fillOpacity="0.08"
    />
    <rect
      x="8"
      y="8"
      width="24"
      height="24"
      rx="3"
      stroke="currentColor"
      strokeWidth="2.2"
      fill="currentColor"
      fillOpacity="0.08"
      transform="rotate(45 20 20)"
    />
    {/* Inner geometric rosette */}
    <circle cx="20" cy="20" r="7" stroke="currentColor" strokeWidth="1.6" fill="none" />
    <circle cx="20" cy="20" r="3" fill="currentColor" />
    <circle cx="20" cy="9.5" r="1.2" fill="currentColor" />
    <circle cx="20" cy="30.5" r="1.2" fill="currentColor" />
    <circle cx="9.5" cy="20" r="1.2" fill="currentColor" />
    <circle cx="30.5" cy="20" r="1.2" fill="currentColor" />
  </svg>
);

/**
 * Islamic Arabesque Corner Ornament (for Prayer Times Widget and Card Headers)
 */
export const ArabesqueCornerOrnament: React.FC<{ className?: string; size?: number }> = ({
  className = 'text-emerald-700/60',
  size = 72
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
  >
    <path
      d="M100,0 L100,60 C85,60 70,55 58,42 C45,30 40,15 40,0 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      opacity="0.3"
    />
    <circle cx="85" cy="15" r="2.5" fill="currentColor" />
    <circle cx="70" cy="30" r="2" fill="currentColor" />
    <circle cx="55" cy="15" r="2" fill="currentColor" />
    <path
      d="M100,20 C85,20 75,30 75,45 C75,60 85,70 100,70"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <path
      d="M30,0 C30,15 40,25 55,25 C70,25 80,15 80,0"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <path
      d="M95,5 C80,20 60,20 45,5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2 2"
      fill="none"
    />
    <path
      d="M100,0 L60,0 C60,22 78,40 100,40 Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.4"
      fill="none"
    />
    <circle cx="80" cy="20" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Islamic Seamless Tessellation Pattern (Arabesque Lattice)
 */
export const ArabesqueTessellationPattern: React.FC<{
  className?: string;
  opacity?: number;
  color?: string;
}> = ({ className = '', opacity = 0.15, color = '#ffffff' }) => (
  <div
    className={`absolute inset-0 pointer-events-none select-none ${className}`}
    style={{
      opacity,
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px), radial-gradient(circle, ${color} 1px, transparent 1px)`,
      backgroundSize: '24px 24px',
      backgroundPosition: '0 0, 12px 12px'
    }}
  />
);

/**
 * Rich Intricate Arabesque Pattern Overlay (For "Help us Better Serve You" section)
 */
export const ArabesqueGeometricBackdrop: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.08
}) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity }}
    aria-hidden="true"
  >
    <defs>
      <pattern id="islamic-star-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
        <path
          d="M30,0 L38,12 L52,8 L48,22 L60,30 L48,38 L52,52 L38,48 L30,60 L22,48 L8,52 L12,38 L0,30 L12,22 L8,8 L22,12 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="30" cy="30" r="4" fill="currentColor" fillOpacity="0.4" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic-star-pattern)" />
  </svg>
);

/**
 * Landscape Sunrise Illustration for Prayer Times Widget
 */
export const SunriseLandscapeGraphic: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 220 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full select-none ${className}`}
  >
    <defs>
      <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#f97316" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hillFront" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="100%" stopColor="#6ee7b7" />
      </linearGradient>
      <linearGradient id="hillBack" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d1fae5" />
        <stop offset="100%" stopColor="#a7f3d0" />
      </linearGradient>
    </defs>

    {/* Sun Circle & Ambient Radiant Corona */}
    <circle cx="75" cy="65" r="44" fill="url(#sunGlow)" opacity="0.35" />
    <circle cx="75" cy="65" r="28" fill="#ea580c" opacity="0.85" />

    {/* Back Hill */}
    <path
      d="M-20,120 Q50,75 120,95 T240,110 L240,120 Z"
      fill="url(#hillBack)"
      opacity="0.8"
    />

    {/* Front Hill */}
    <path
      d="M-20,120 Q60,95 130,85 T240,105 L240,120 Z"
      fill="url(#hillFront)"
      opacity="0.9"
    />
  </svg>
);

/**
 * Bespoke Hero Islamic Artwork:
 * Illuminated Masjid Domes, Minarets, Crescent, and Two Worshippers in White
 * Exactly matching the Dribbble Hero right side composition
 */
export const HeroMosqueIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 540 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-auto select-none ${className}`}
  >
    <defs>
      {/* Background ambient moonlight glow */}
      <radialGradient id="sanctuaryGlow" cx="0.5" cy="0.45" r="0.5">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
        <stop offset="60%" stopColor="#059669" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
      </radialGradient>

      {/* Prophet's Mosque Green Dome Gradient */}
      <linearGradient id="prophetDomeGrad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="35%" stopColor="#16a34a" />
        <stop offset="85%" stopColor="#15803d" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>

      {/* Flanking Domes Gradient */}
      <linearGradient id="flankDomeGrad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="45%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#166534" />
      </linearGradient>

      {/* Minaret Pillar Gradient */}
      <linearGradient id="minaretPillar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#064e3b" />
        <stop offset="30%" stopColor="#047857" />
        <stop offset="70%" stopColor="#0f766e" />
        <stop offset="100%" stopColor="#044e3a" />
      </linearGradient>

      {/* Archway Interior Glow */}
      <linearGradient id="sanctuaryInterior" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#022c22" />
        <stop offset="100%" stopColor="#011b15" />
      </linearGradient>
    </defs>

    {/* Background Soft Moonlight Glow */}
    <circle cx="270" cy="180" r="180" fill="url(#sanctuaryGlow)" />

    {/* Crescent Moon & Evening Stars */}
    <path
      d="M390,65 A14,14 0 1,1 404,79 A11,11 0 1,0 390,65 Z"
      fill="#fef08a"
      opacity="0.9"
    />
    <circle cx="150" cy="90" r="1.5" fill="#fef08a" opacity="0.8" />
    <circle cx="180" cy="60" r="2" fill="#fef08a" opacity="0.9" />
    <circle cx="220" cy="85" r="1.2" fill="#fef08a" opacity="0.75" />
    <circle cx="340" cy="70" r="1.8" fill="#fef08a" opacity="0.85" />
    <circle cx="430" cy="100" r="1.5" fill="#fef08a" opacity="0.7" />

    {/* Twin Minarets (Architectural Left & Right) */}
    {/* Left Minaret */}
    <g transform="translate(100, 40)">
      {/* Finial & Crescent */}
      <line x1="16" y1="10" x2="16" y2="30" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
      <path d="M14,12 A3,3 0 1,1 18,16 A2.5,2.5 0 1,0 14,12 Z" fill="#fde047" />
      {/* Top Cap */}
      <path d="M8,30 L16,18 L24,30 Z" fill="#34d399" />
      {/* Upper Balcony */}
      <rect x="5" y="30" width="22" height="6" rx="2" fill="#047857" />
      <rect x="10" y="36" width="12" height="40" fill="url(#minaretPillar)" />
      {/* Middle Balcony with Muqarnas bracket */}
      <rect x="3" y="76" width="26" height="8" rx="2" fill="#065f46" />
      <path d="M6,84 L26,84 L22,96 L10,96 Z" fill="#047857" />
      {/* Main Minaret Shaft */}
      <rect x="8" y="96" width="16" height="170" fill="url(#minaretPillar)" />
      {/* Arched windows in minaret */}
      <rect x="13" y="120" width="6" height="12" rx="3" fill="#fef08a" opacity="0.85" />
      <rect x="13" y="160" width="6" height="12" rx="3" fill="#fef08a" opacity="0.85" />
      <rect x="13" y="200" width="6" height="12" rx="3" fill="#fef08a" opacity="0.85" />
      {/* Base */}
      <rect x="4" y="266" width="24" height="24" rx="2" fill="#064e3b" />
    </g>

    {/* Right Minaret */}
    <g transform="translate(410, 40)">
      {/* Finial & Crescent */}
      <line x1="16" y1="10" x2="16" y2="30" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
      <path d="M14,12 A3,3 0 1,1 18,16 A2.5,2.5 0 1,0 14,12 Z" fill="#fde047" />
      {/* Top Cap */}
      <path d="M8,30 L16,18 L24,30 Z" fill="#34d399" />
      {/* Upper Balcony */}
      <rect x="5" y="30" width="22" height="6" rx="2" fill="#047857" />
      <rect x="10" y="36" width="12" height="40" fill="url(#minaretPillar)" />
      {/* Middle Balcony */}
      <rect x="3" y="76" width="26" height="8" rx="2" fill="#065f46" />
      <path d="M6,84 L26,84 L22,96 L10,96 Z" fill="#047857" />
      {/* Main Minaret Shaft */}
      <rect x="8" y="96" width="16" height="170" fill="url(#minaretPillar)" />
      {/* Arched windows */}
      <rect x="13" y="120" width="6" height="12" rx="3" fill="#fef08a" opacity="0.85" />
      <rect x="13" y="160" width="6" height="12" rx="3" fill="#fef08a" opacity="0.85" />
      <rect x="13" y="200" width="6" height="12" rx="3" fill="#fef08a" opacity="0.85" />
      {/* Base */}
      <rect x="4" y="266" width="24" height="24" rx="2" fill="#064e3b" />
    </g>

    {/* Flanking Secondary Domes */}
    {/* Left Flanking Dome */}
    <g transform="translate(150, 160)">
      <path
        d="M10,120 C10,40 50,25 50,25 C50,25 90,40 90,120 Z"
        fill="url(#flankDomeGrad)"
        opacity="0.9"
      />
      <line x1="50" y1="25" x2="50" y2="10" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="9" r="2" fill="#fde047" />
      <rect x="15" y="115" width="70" height="25" rx="3" fill="#065f46" />
      <rect x="30" y="120" width="8" height="12" rx="4" fill="#fef08a" opacity="0.75" />
      <rect x="46" y="120" width="8" height="12" rx="4" fill="#fef08a" opacity="0.75" />
      <rect x="62" y="120" width="8" height="12" rx="4" fill="#fef08a" opacity="0.75" />
    </g>

    {/* Right Flanking Dome */}
    <g transform="translate(290, 160)">
      <path
        d="M10,120 C10,40 50,25 50,25 C50,25 90,40 90,120 Z"
        fill="url(#flankDomeGrad)"
        opacity="0.9"
      />
      <line x1="50" y1="25" x2="50" y2="10" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="9" r="2" fill="#fde047" />
      <rect x="15" y="115" width="70" height="25" rx="3" fill="#065f46" />
      <rect x="30" y="120" width="8" height="12" rx="4" fill="#fef08a" opacity="0.75" />
      <rect x="46" y="120" width="8" height="12" rx="4" fill="#fef08a" opacity="0.75" />
      <rect x="62" y="120" width="8" height="12" rx="4" fill="#fef08a" opacity="0.75" />
    </g>

    {/* Central Prophet's Mosque Green Dome (Al-Qubbah Al-Khadra) */}
    <g transform="translate(195, 95)">
      {/* Finial Crescent */}
      <line x1="75" y1="35" x2="75" y2="5" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M71,6 A6,6 0 1,1 79,14 A5,5 0 1,0 71,6 Z"
        fill="#fde047"
      />
      <circle cx="75" cy="18" r="3" fill="#fde047" />
      <circle cx="75" cy="27" r="2.5" fill="#fde047" />

      {/* The Parabolic Green Dome */}
      <path
        d="M10,185 C10,75 75,35 75,35 C75,35 140,75 140,185 Z"
        fill="url(#prophetDomeGrad)"
      />

      {/* Architectural ribs on Green Dome */}
      <path d="M75,35 Q50,110 40,185" stroke="#86efac" strokeWidth="1.8" strokeOpacity="0.45" fill="none" />
      <path d="M75,35 Q100,110 110,185" stroke="#86efac" strokeWidth="1.8" strokeOpacity="0.45" fill="none" />
      <path d="M75,35 Q65,110 60,185" stroke="#86efac" strokeWidth="1.2" strokeOpacity="0.3" fill="none" />
      <path d="M75,35 Q85,110 90,185" stroke="#86efac" strokeWidth="1.2" strokeOpacity="0.3" fill="none" />

      {/* Dome Drum & Arched Clerestory Windows */}
      <rect x="12" y="175" width="126" height="30" rx="3" fill="#047857" />
      <rect x="25" y="180" width="10" height="18" rx="5" fill="#fef08a" opacity="0.9" />
      <rect x="45" y="180" width="10" height="18" rx="5" fill="#fef08a" opacity="0.9" />
      <rect x="70" y="180" width="10" height="18" rx="5" fill="#fef08a" opacity="0.9" />
      <rect x="95" y="180" width="10" height="18" rx="5" fill="#fef08a" opacity="0.9" />
      <rect x="115" y="180" width="10" height="18" rx="5" fill="#fef08a" opacity="0.9" />
    </g>

    {/* Foreground Colonnade with Classical Islamic Moorish Arches */}
    <g transform="translate(80, 275)">
      {/* Base wall */}
      <rect x="0" y="30" width="380" height="95" fill="url(#sanctuaryInterior)" rx="6" />

      {/* Arch 1 */}
      <path
        d="M25,125 L25,60 C25,35 65,35 65,60 L65,125 Z"
        fill="#047857"
        opacity="0.95"
      />
      <path
        d="M32,125 L32,65 C32,45 58,45 58,65 L58,125 Z"
        fill="#fef08a"
        opacity="0.75"
      />

      {/* Arch 2 */}
      <path
        d="M85,125 L85,55 C85,25 135,25 135,55 L135,125 Z"
        fill="#047857"
        opacity="0.95"
      />
      <path
        d="M93,125 L93,60 C93,35 127,35 127,60 L127,125 Z"
        fill="#fef08a"
        opacity="0.8"
      />

      {/* Center Grand Arch (Portal) */}
      <path
        d="M150,125 L150,45 C150,10 230,10 230,45 L230,125 Z"
        fill="#065f46"
      />
      <path
        d="M160,125 L160,55 C160,25 220,25 220,55 L220,125 Z"
        fill="#fef08a"
        opacity="0.9"
      />
      {/* Lantern hanging in Grand Portal */}
      <line x1="190" y1="40" x2="190" y2="70" stroke="#fde047" strokeWidth="1.5" />
      <path d="M185,70 L195,70 L193,82 L187,82 Z" fill="#fde047" />

      {/* Arch 4 */}
      <path
        d="M245,125 L245,55 C245,25 295,25 295,55 L295,125 Z"
        fill="#047857"
        opacity="0.95"
      />
      <path
        d="M253,125 L253,60 C253,35 287,35 287,60 L287,125 Z"
        fill="#fef08a"
        opacity="0.8"
      />

      {/* Arch 5 */}
      <path
        d="M315,125 L315,60 C315,35 355,35 355,60 L355,125 Z"
        fill="#047857"
        opacity="0.95"
      />
      <path
        d="M322,125 L322,65 C322,45 348,45 348,65 L348,125 Z"
        fill="#fef08a"
        opacity="0.75"
      />

      {/* Ground Courtyard Glow Line */}
      <line x1="0" y1="125" x2="380" y2="125" stroke="#34d399" strokeWidth="2.5" strokeOpacity="0.4" />
    </g>
  </svg>
);

/**
 * Watermark Calligraphy for Page Margins (mimicking the delicate side watermarks in the Dribbble design)
 */
export const ArabicCalligraphyGutter: React.FC<{
  side: 'left' | 'right';
  className?: string;
}> = ({ side, className = '' }) => (
  <div
    className={`absolute top-24 ${
      side === 'left' ? '-left-12 lg:left-2' : '-right-12 lg:right-2'
    } pointer-events-none select-none text-emerald-900/[0.04] dark:text-emerald-400/[0.03] z-0 hidden sm:block ${className}`}
    aria-hidden="true"
  >
    <div
      className="font-arabic text-8xl lg:text-9xl leading-none tracking-widest writing-vertical-rl select-none transform rotate-90"
      style={{ filter: 'blur(0.5px)' }}
    >
      {side === 'left' ? 'ٱللَّٰه' : 'مُحَمَّد'}
    </div>
  </div>
);

/**
 * Standard Pure Calligraphic Inscription (Bismillah)
 */
export const BismillahEmblem: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`text-center select-none py-1 ${className}`}>
    <span
      className="font-arabic text-xl sm:text-2xl text-emerald-900 font-normal tracking-normal"
      dir="rtl"
    >
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </span>
  </div>
);

/**
 * Standard Divider
 */
export const IslamicDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-full h-px bg-emerald-100 ${className}`} />
);

/**
 * Legacy support for IslamicStarIcon
 */
export const IslamicStarIcon = IslamicStarEmblem;
export const OrnateCorner: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br'; className?: string }> = ({
  position,
  className = 'text-emerald-200'
}) => {
  const rotation = {
    tl: 'rotate-0',
    tr: 'rotate-90',
    br: 'rotate-180',
    bl: '-rotate-90'
  }[position];

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`${rotation} ${className} pointer-events-none select-none`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1H10M1 1V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
