"use client";

import React, { useMemo } from 'react';
import { WAVEFORM_DATA, STEMS } from '@/lib/song-data';

interface IntegratedWaveformProps {
  isPlaying: boolean;
}

export function IntegratedWaveform({ isPlaying }: IntegratedWaveformProps) {
  // Merge multiple stems for a rich hero visual
  const data = useMemo(() => {
    const melody = WAVEFORM_DATA.melody;
    const drums = WAVEFORM_DATA.drums;
    const bass = WAVEFORM_DATA.bass;
    return melody.map((v, i) => (v + (drums[i] || 0.5) + (bass[i] || 0.3)) / 3);
  }, []);

  return (
    <div className="absolute inset-0 w-full flex items-center justify-center gap-1 px-20 pointer-events-none overflow-hidden">
      {data.map((val, i) => {
        const progress = i / data.length;
        let color = '#FF8000'; // Orange
        if (progress > 0.33) color = '#00F0FF'; // Cyan
        if (progress > 0.66) color = '#C04DFF'; // Violet

        const heightScale = isPlaying ? 1.4 : 0.6;
        const animationDelay = `${i * 0.03}s`;

        return (
          <div key={i} className="flex flex-col items-center justify-center flex-1 min-w-[4px] gap-1 relative group">
             {/* Symmetrical reflection */}
            <div 
              className="w-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                height: `${val * 240 * heightScale}px`,
                backgroundColor: color,
                boxShadow: isPlaying ? `0 0 40px ${color}88` : `0 0 10px ${color}33`,
                opacity: isPlaying ? 0.9 : 0.3,
                animation: isPlaying ? `block-pulse 1.2s infinite ${animationDelay}` : 'none'
              }}
            />
            {/* Mirror shadow */}
            <div 
              className="w-full rounded-full transition-all duration-700 opacity-20 blur-[2px]"
              style={{ 
                height: `${val * 100 * heightScale}px`,
                backgroundColor: color,
                transform: 'translateY(120%) scaleY(0.5)'
              }}
            />
          </div>
        );
      })}

      {/* Digital Horizon Lines */}
      <div className="absolute w-full h-[1px] bg-white/10 top-1/2 -translate-y-1/2 z-0" />
      <div className="absolute w-full h-[400px] bg-gradient-to-t from-transparent via-primary/5 to-transparent top-1/2 -translate-y-1/2 blur-[100px] z-0 opacity-40" />
      
      {/* Decorative Phase Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-64 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] w-screen bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
