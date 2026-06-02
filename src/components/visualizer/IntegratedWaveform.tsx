"use client";

import React, { useMemo } from 'react';
import { WAVEFORM_DATA } from '@/lib/song-data';

interface IntegratedWaveformProps {
  isPlaying: boolean;
}

export function IntegratedWaveform({ isPlaying }: IntegratedWaveformProps) {
  // Use melody and drums as the base for the big hero visual
  const data = useMemo(() => {
    const melody = WAVEFORM_DATA.melody;
    const drums = WAVEFORM_DATA.drums;
    return melody.map((v, i) => (v + (drums[i] || 0.5)) / 2);
  }, []);

  return (
    <div className="absolute inset-0 w-full flex items-center justify-center gap-1 px-10 pointer-events-none overflow-hidden">
      {data.map((val, i) => {
        // Gradient logic across the width
        const progress = i / data.length;
        let color = '#FF8000'; // Orange
        if (progress > 0.33) color = '#00F0FF'; // Cyan
        if (progress > 0.66) color = '#C04DFF'; // Violet

        const heightScale = isPlaying ? 1.2 : 0.8;
        const animationDelay = `${i * 0.05}s`;

        return (
          <div key={i} className="flex flex-col items-center justify-center flex-1 min-w-[3px] gap-1">
             {/* Symmetrical reflection */}
            <div 
              className="w-full rounded-full transition-all duration-300"
              style={{ 
                height: `${val * 150 * heightScale}px`,
                backgroundColor: color,
                boxShadow: `0 0 20px ${color}66`,
                animation: isPlaying ? `block-pulse 1s infinite ${animationDelay}` : 'none'
              }}
            />
          </div>
        );
      })}

      {/* Aesthetic horizon lines */}
      <div className="absolute w-full h-[1px] bg-white/5 top-1/2 -translate-y-1/2 z-0" />
      <div className="absolute w-full h-[100px] bg-gradient-to-t from-transparent via-secondary/5 to-transparent top-1/2 -translate-y-1/2 blur-3xl z-0" />
    </div>
  );
}
