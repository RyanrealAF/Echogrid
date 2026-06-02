/**
 * @fileOverview High-performance integrated waveform visualizer for the hero section.
 */
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { WAVEFORM_DATA } from '@/lib/song-data';
import { cn } from '@/lib/utils';

interface IntegratedWaveformProps {
  isPlaying: boolean;
}

export function IntegratedWaveform({ isPlaying }: IntegratedWaveformProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Summate stems for a richer central visual
  const combinedData = useMemo(() => {
    const melody = WAVEFORM_DATA.melody;
    const drums = WAVEFORM_DATA.drums;
    const bass = WAVEFORM_DATA.bass;
    return melody.map((v, i) => (v + (drums[i] || 0.5) * 0.8 + (bass[i] || 0.3) * 1.2) / 2.5);
  }, []);

  return (
    <div className="absolute inset-0 w-full flex items-center justify-center gap-[2px] px-24 pointer-events-none overflow-hidden">
      {combinedData.map((val, i) => {
        const progress = i / combinedData.length;
        let color = '#FF8000'; // WAVIE Primary Orange
        if (progress > 0.35) color = '#00F0FF'; // WAVIE Secondary Cyan
        if (progress > 0.70) color = '#C04DFF'; // WAVIE Accent Violet

        const heightScale = isPlaying ? 1.6 : 0.45;
        // Animation delay must be client-side only to avoid hydration mismatch if using Date or random
        const animationDelay = `${i * 0.04}s`;

        return (
          <div key={i} className="flex flex-col items-center justify-center flex-1 min-w-[3px] gap-[2px] relative">
             {/* Main Bar */}
            <div 
              className="w-full rounded-full transition-all duration-700 ease-out"
              style={{ 
                height: `${val * 280 * heightScale}px`,
                backgroundColor: color,
                boxShadow: isPlaying ? `0 0 45px ${color}99` : `0 0 10px ${color}22`,
                opacity: isPlaying ? 0.85 : 0.25,
                animation: mounted && isPlaying ? `block-pulse 1.4s infinite ease-in-out ${animationDelay}` : 'none'
              }}
            />
            {/* Mirror Reflection */}
            <div 
              className="w-full rounded-full transition-all duration-1000 opacity-20 blur-[3px]"
              style={{ 
                height: `${val * 120 * heightScale}px`,
                backgroundColor: color,
                transform: 'translateY(110%) scaleY(0.4)'
              }}
            />
          </div>
        );
      })}

      {/* Digital Floor / Horizon Grid */}
      <div className="absolute w-full h-[1px] bg-white/[0.08] top-1/2 -translate-y-1/2 z-0" />
      <div className="absolute w-full h-[500px] bg-gradient-to-t from-transparent via-primary/5 to-transparent top-1/2 -translate-y-1/2 blur-[120px] z-0 opacity-30" />
      
      {/* Aesthetic Crosshairs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/[0.03] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-80 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] w-screen bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}
