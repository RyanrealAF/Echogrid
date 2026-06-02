/**
 * @fileOverview Word-level precision lyrics overlay with cinematic typography.
 */
"use client";

import React, { useMemo } from 'react';
import { SongSection } from '@/lib/song-data';
import { cn } from '@/lib/utils';

interface LyricsOverlayProps {
  currentTime: number;
  currentSection: SongSection | null;
}

export function LyricsOverlay({ currentTime, currentSection }: LyricsOverlayProps) {
  const activeLineIndex = useMemo(() => {
    if (!currentSection) return -1;
    let index = -1;
    for (let i = 0; i < currentSection.lines.length; i++) {
      const line = currentSection.lines[i];
      const nextLineStart = currentSection.lines[i+1]?.words[0].start || Infinity;
      if (currentTime >= line.words[0].start && currentTime < nextLineStart) {
        index = i;
      }
    }
    return index;
  }, [currentSection, currentTime]);

  if (!currentSection) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center select-none pointer-events-none z-30">
      <div className="max-w-7xl">
        {currentSection.lines.map((line, lIdx) => (
          <div 
            key={lIdx} 
            className={cn(
              "transition-all duration-1000 flex flex-wrap justify-center gap-x-4 gap-y-4",
              activeLineIndex === lIdx ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90"
            )}
          >
            {line.words.map((wordObj, wIdx) => {
              const isActive = currentTime >= wordObj.start;
              // A word is "current" if we are past its start time and either there is no next word or we are before the next word's start time
              const isCurrent = isActive && (line.words[wIdx+1] ? currentTime < line.words[wIdx+1].start : true);
              
              const isImpact = wordObj.accent || wordObj.word.length > 5 || wordObj.word === wordObj.word.toUpperCase();

              return (
                <span
                  key={wIdx}
                  className={cn(
                    "transition-all duration-500 transform inline-block leading-none",
                    isImpact 
                      ? "text-6xl md:text-8xl font-black uppercase tracking-tighter" 
                      : "text-3xl md:text-5xl font-medium italic lowercase tracking-tight opacity-80",
                    isActive ? "text-white" : "text-white/5",
                    isCurrent && isImpact && "glow-text scale-110 -translate-y-2 brightness-200",
                    isCurrent && !isImpact && "text-white/90 scale-105 opacity-100"
                  )}
                >
                  {wordObj.word}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Ambient Section Type Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 opacity-20">
        <span className="text-[10px] font-black tracking-[1em] text-white uppercase italic">
          // {currentSection.type}_VOX_BUFFER
        </span>
      </div>
    </div>
  );
}
