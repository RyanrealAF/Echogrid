
"use client";

import React, { useState, useEffect } from 'react';
import { WAVEFORM_DATA, StemType } from '@/lib/song-data';
import { cn } from '@/lib/utils';

interface WaveformStripProps {
  stem: StemType;
  isActive: boolean;
  isPlaying: boolean;
}

export function WaveformStrip({ stem, isActive, isPlaying }: WaveformStripProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const data = WAVEFORM_DATA[stem];
  
  return (
    <div className="flex flex-col gap-1 w-full opacity-60 hover:opacity-100 transition-opacity">
      <div className="flex justify-between items-center px-2">
        <span className={cn(
          "text-[10px] uppercase font-bold tracking-widest",
          isActive ? "text-primary" : "text-muted-foreground"
        )}>
          {stem}
        </span>
        {isActive && isPlaying && mounted && (
          <div className="flex gap-0.5 items-end h-3">
             <div className="w-0.5 bg-primary animate-pulse h-full" style={{ animationDelay: '0s' }} />
             <div className="w-0.5 bg-primary animate-pulse h-2/3" style={{ animationDelay: '0.1s' }} />
             <div className="w-0.5 bg-primary animate-pulse h-1/2" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
      </div>
      <div className="h-16 w-full flex items-center gap-0.5 overflow-hidden">
        {data.map((val, i) => {
          // Use static values for the first render to match server (hydration safety)
          const initialOpacity = isActive ? 0.8 : 0.3;
          // After mounting, we can introduce dynamic visuals if playing
          const currentOpacity = mounted && isPlaying && isActive
            ? 0.4 + (Math.sin(Date.now() / 1000 + i) * 0.2 + 0.4) // Deterministic-ish pulse
            : initialOpacity;

          return (
            <div 
              key={i}
              className={cn(
                "flex-1 min-w-[2px] transition-all duration-300",
                isActive ? "bg-primary" : "bg-muted-foreground/30"
              )}
              style={{ 
                height: `${(val * 100).toFixed(2)}%`,
                opacity: currentOpacity
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
