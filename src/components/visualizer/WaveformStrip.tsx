
"use client";

import React from 'react';
import { WAVEFORM_DATA, StemType } from '@/lib/song-data';
import { cn } from '@/lib/utils';

interface WaveformStripProps {
  stem: StemType;
  isActive: boolean;
  isPlaying: boolean;
}

export function WaveformStrip({ stem, isActive, isPlaying }: WaveformStripProps) {
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
        {isActive && isPlaying && (
          <div className="flex gap-0.5 items-end h-3">
             <div className="w-0.5 bg-primary animate-pulse h-full" style={{ animationDelay: '0s' }} />
             <div className="w-0.5 bg-primary animate-pulse h-2/3" style={{ animationDelay: '0.1s' }} />
             <div className="w-0.5 bg-primary animate-pulse h-1/2" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
      </div>
      <div className="h-16 w-full flex items-center gap-0.5 overflow-hidden">
        {data.map((val, i) => (
          <div 
            key={i}
            className={cn(
              "flex-1 min-w-[2px] transition-all duration-300",
              isActive ? "bg-primary" : "bg-muted-foreground/30"
            )}
            style={{ 
              height: `${val * 100}%`,
              opacity: isActive ? (isPlaying ? 0.4 + (Math.random() * 0.6) : 0.8) : 0.3
            }}
          />
        ))}
      </div>
    </div>
  );
}
