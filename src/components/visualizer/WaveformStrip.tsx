"use client";

import React, { useState, useEffect } from 'react';
import { WAVEFORM_DATA, StemType } from '@/lib/song-data';
import { cn } from '@/lib/utils';
import { Mic2, Music, Waves, Disc, Activity } from 'lucide-react';

interface WaveformStripProps {
  stem: StemType;
  isActive: boolean;
  isPlaying: boolean;
}

const STEM_ICONS: Record<StemType, any> = {
  vocals: Mic2,
  drums: Activity,
  bass: Waves,
  melody: Music,
  harmonies: Disc,
  fx: Activity,
};

export function WaveformStrip({ stem, isActive, isPlaying }: WaveformStripProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const data = WAVEFORM_DATA[stem];
  const Icon = STEM_ICONS[stem];
  
  return (
    <div className={cn(
      "flex flex-col gap-3 w-full p-3 rounded-lg border transition-all duration-500",
      isActive ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/5" : "border-white/5 bg-white/5 opacity-30 hover:opacity-50"
    )}>
      {/* Header Info */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-1.5 rounded-md",
            isActive ? "bg-primary text-primary-foreground" : "bg-white/10 text-white/40"
          )}>
            <Icon className="w-3 h-3" />
          </div>
          <span className={cn(
            "text-[9px] uppercase font-black tracking-widest",
            isActive ? "text-primary glow-text" : "text-muted-foreground"
          )}>
            {stem}
          </span>
        </div>
        
        {/* Status LED */}
        <div className="flex gap-1 items-center">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors duration-300",
            isActive && isPlaying ? "bg-secondary animate-pulse shadow-[0_0_8px_#8CCBFF]" : "bg-white/10"
          )} />
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="h-20 w-full flex items-center gap-0.5 overflow-hidden">
        {data.map((val, i) => {
          const initialOpacity = isActive ? 0.9 : 0.2;
          const currentOpacity = mounted && isPlaying && isActive
            ? 0.5 + (Math.sin(Date.now() / 150 + i * 0.5) * 0.4 + 0.1)
            : initialOpacity;

          return (
            <div 
              key={i}
              className={cn(
                "flex-1 min-w-[2px] rounded-full transition-all duration-200",
                isActive ? "bg-primary shadow-[0_0_5px_rgba(119,74,221,0.3)]" : "bg-white/10"
              )}
              style={{ 
                height: `${(val * 100).toFixed(2)}%`,
                opacity: currentOpacity
              }}
            />
          );
        })}
      </div>

      {/* Meter Bar Footer */}
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-1">
        <div 
          className={cn(
            "h-full transition-all duration-500",
            isActive ? "bg-secondary w-full opacity-80" : "bg-white/10 w-0"
          )}
        />
      </div>
    </div>
  );
}
