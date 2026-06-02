"use client";

import React, { useMemo } from 'react';
import { Word, LyricLine, SongSection } from '@/lib/song-data';
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
    <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center select-none pointer-events-none z-30">
      <div className="max-w-6xl">
        {currentSection.lines.map((line, lIdx) => (
          <div 
            key={lIdx} 
            className={cn(
              "transition-all duration-700 flex flex-wrap justify-center gap-x-3 gap-y-2",
              activeLineIndex === lIdx ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            {line.words.map((wordObj, wIdx) => {
              const isActive = currentTime >= wordObj.start;
              const isCurrent = isActive && (line.words[wIdx+1] ? currentTime < line.words[wIdx+1].start : true);
              
              // WAVIE Style: Highlighting "impact" words vs connective tissue
              const isImpact = wordObj.accent || wordObj.word.length > 5 || wordObj.word === wordObj.word.toUpperCase();

              return (
                <span
                  key={wIdx}
                  className={cn(
                    "transition-all duration-300 transform",
                    isImpact 
                      ? "text-5xl md:text-7xl font-black uppercase tracking-tighter" 
                      : "text-3xl md:text-4xl font-medium italic lowercase tracking-tight",
                    isActive ? "text-white" : "text-white/10",
                    isCurrent && isImpact && "glow-text scale-110 -translate-y-1 brightness-150",
                    isCurrent && !isImpact && "text-white/90 scale-105"
                  )}
                >
                  {wordObj.word}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
