'use client';

import React, { useEffect, useState, memo, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import heavy WebGL shader components without blocking SSR or initial FCP
const MeshGradient = dynamic(
  () => import('@paper-design/shaders-react').then((mod) => mod.MeshGradient),
  { ssr: false }
);
const Warp = dynamic(
  () => import('@paper-design/shaders-react').then((mod) => mod.Warp),
  { ssr: false }
);
const GodRays = dynamic(
  () => import('@paper-design/shaders-react').then((mod) => mod.GodRays),
  { ssr: false }
);
const Waves = dynamic(
  () => import('@paper-design/shaders-react').then((mod) => mod.Waves),
  { ssr: false }
);

// The library defaults to rendering at >=2x device pixels (up to ~8.3M px per canvas).
// These are soft, blurry gradients, so render at native density with a 720p pixel budget
// and let the browser upscale — visually identical, a fraction of the GPU fill cost.
const RENDER_QUALITY = {
  minPixelRatio: 1,
  maxPixelCount: 1280 * 720
};

export type ShaderVariant = 'aurora' | 'emerald' | 'sage' | 'gold' | 'night' | 'ambient' | 'dawn';
export type ShaderType = 'mesh' | 'godrays' | 'waves' | 'warp';

export interface IslamicShaderBackgroundProps {
  className?: string;
  type?: ShaderType;
  variant?: ShaderVariant;
  speed?: number;
  distortion?: number;
  swirl?: number;
  opacity?: number;
  intensity?: number;
  fixed?: boolean;
  isPageBackground?: boolean;
}

export const IslamicShaderBackground: React.FC<IslamicShaderBackgroundProps> = memo(({
  className = '',
  type = 'mesh',
  variant = 'ambient',
  speed = 0.08,
  distortion = 0.45,
  swirl = 0.35,
  opacity = 1,
  intensity = 0.5,
  fixed = false,
  isPageBackground = false
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkCapabilities = () => {
      const desktop = window.innerWidth >= 768;
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsDesktop(desktop);
      setReducedMotion(motion);
    };

    checkCapabilities();
    window.addEventListener('resize', checkCapabilities, { passive: true });
    return () => window.removeEventListener('resize', checkCapabilities);
  }, []);

  const colorMap: Record<ShaderVariant, string[]> = useMemo(() => ({
    ambient: ['#d5eedc', '#a6dec0', '#4dbd84', '#1d7348', '#e2cfab', '#eaf6ef'],
    sage: ['#dcfce7', '#86efac', '#22c55e', '#166534', '#fef08a', '#bbf7d0'],
    dawn: ['#fef3c7', '#fde68a', '#6ee7b7', '#10b981', '#f59e0b', '#fffbeb'],
    aurora: ['#062616', '#0d4a2b', '#16a34a', '#4ade80', '#d97706', '#042113'],
    emerald: ['#052314', '#0f5132', '#198754', '#20c997', '#0a3622'],
    gold: ['#0f3d24', '#156b3e', '#d97706', '#f59e0b', '#78350f'],
    night: ['#02180f', '#063a22', '#0d5c38', '#10b981', '#010f0a']
  }), []);

  const selectedColors = colorMap[variant] || colorMap.ambient;
  const isLightVariant = variant === 'ambient' || variant === 'sage' || variant === 'dawn';
  const isFixed = fixed || isPageBackground;

  // On mobile screens (< 768px) or reduced-motion devices:
  // Render an ultra-smooth, GPU-free CSS ambient mesh gradient for 120Hz scrolling
  const renderWebGL = isMounted && isDesktop && !reducedMotion;

  return (
    <div
      className={`${isFixed ? 'fixed inset-0' : 'absolute inset-0'} overflow-hidden pointer-events-none select-none ${className}`}
      style={{ opacity, willChange: 'opacity' }}
      aria-hidden="true"
    >
      {/* High-speed CSS fallback gradient with hardware acceleration */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 transform-gpu ${
          isLightVariant
            ? 'bg-gradient-to-br from-[#dff2e5] via-[#cfebd8] to-[#eaf5ee]'
            : 'bg-gradient-to-br from-[#072517] via-[#0d4528] to-[#041a10]'
        }`}
      />

      {/* Mobile-optimized CSS radial glow accents */}
      {!renderWebGL && (
        <div
          className={`absolute inset-0 transform-gpu ${
            isLightVariant
              ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(217,119,6,0.12),transparent_60%)]'
              : 'bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.15),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.1),transparent_60%)]'
          }`}
        />
      )}

      {/* Desktop WebGL Interactive Shader */}
      {renderWebGL && (
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
            isLightVariant ? 'opacity-100' : 'mix-blend-screen opacity-95'
          }`}
        >
          {type === 'mesh' && (
            <MeshGradient
              colors={selectedColors}
              speed={speed}
              distortion={distortion}
              swirl={swirl}
              grainOverlay={0.03}
              grainMixer={0.04}
              {...RENDER_QUALITY}
              style={{ width: '100%', height: '100%' }}
            />
          )}

          {type === 'warp' && (
            <Warp
              colors={selectedColors.slice(0, 6)}
              speed={speed}
              distortion={distortion}
              swirl={swirl}
              proportion={0.4}
              softness={0.9}
              shape="checks"
              shapeScale={0.12}
              {...RENDER_QUALITY}
              style={{ width: '100%', height: '100%' }}
            />
          )}

          {type === 'godrays' && (
            <GodRays
              colors={selectedColors.slice(0, 5)}
              colorBack={selectedColors[0]}
              colorBloom={selectedColors[4] || '#f59e0b'}
              bloom={0.45}
              intensity={intensity}
              density={0.35}
              speed={speed}
              {...RENDER_QUALITY}
              style={{ width: '100%', height: '100%' }}
            />
          )}

          {type === 'waves' && (
            <Waves
              colorFront={selectedColors[2] || '#10b981'}
              colorBack={selectedColors[0] || '#062b19'}
              frequency={0.65}
              amplitude={0.35}
              softness={0.7}
              shape={1}
              {...RENDER_QUALITY}
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </div>
      )}
    </div>
  );
});

IslamicShaderBackground.displayName = 'IslamicShaderBackground';
