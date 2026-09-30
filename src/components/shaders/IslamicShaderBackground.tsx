'use client';

import React, { useEffect, useState, memo } from 'react';
import { MeshGradient, GodRays, Waves, Warp } from '@paper-design/shaders-react';

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Impressive, high-contrast, living Islamic color palettes:
  // Designed so fluid motion, wave ripples, and organic light are VISIBLY STUNNING and clearly alive.
  const colorMap: Record<ShaderVariant, string[]> = {
    // 1. Serene Living Mint & Jade (Light, high-contrast, beautiful for page backgrounds — NEVER blank white!)
    ambient: ['#d5eedc', '#a6dec0', '#4dbd84', '#1d7348', '#e2cfab', '#eaf6ef'],
    
    // 2. Fresh Meadow & Olive Sage (Light, refreshing, organic)
    sage: ['#dcfce7', '#86efac', '#22c55e', '#166534', '#fef08a', '#bbf7d0'],
    
    // 3. Fajr Dawn Celestial Light (Light, warm amber and morning mint)
    dawn: ['#fef3c7', '#fde68a', '#6ee7b7', '#10b981', '#f59e0b', '#fffbeb'],

    // 4. Majestic Living Islamic Aurora (Deep Emerald, Jade, Luminous Mint, Warm Amber Gold, Deep Forest)
    aurora: ['#062616', '#0d4a2b', '#16a34a', '#4ade80', '#d97706', '#042113'],
    
    // 5. Royal Deep Emerald Jewel (Mosque carpet & dome deep greens)
    emerald: ['#052314', '#0f5132', '#198754', '#20c997', '#0a3622'],
    
    // 6. Sacred Celestial Gold & Emerald (Warm illuminated amber)
    gold: ['#0f3d24', '#156b3e', '#d97706', '#f59e0b', '#78350f'],
    
    // 7. Midnight Sanctuary (Deep night prayer serenity)
    night: ['#02180f', '#063a22', '#0d5c38', '#10b981', '#010f0a']
  };

  const selectedColors = colorMap[variant] || colorMap.ambient;
  const isLightVariant = variant === 'ambient' || variant === 'sage' || variant === 'dawn';
  const isFixed = fixed || isPageBackground;

  return (
    <div
      className={`${isFixed ? 'fixed inset-0' : 'absolute inset-0'} overflow-hidden pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* High-speed CSS fallback gradient for instant render and zero blank flash */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isLightVariant
            ? 'bg-gradient-to-br from-[#dff2e5] via-[#cfebd8] to-[#eaf5ee]'
            : 'bg-gradient-to-br from-[#072517] via-[#0d4528] to-[#041a10]'
        }`}
      />

      {isMounted && (
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
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </div>
      )}
    </div>
  );
});

IslamicShaderBackground.displayName = 'IslamicShaderBackground';
