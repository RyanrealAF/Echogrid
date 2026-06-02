
"use client";

import React, { useMemo } from 'react';
import { SONG_METADATA, Word, LyricLine, SongSection } from '@/lib/song-data';
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
    <div className="flex flex-col items-center justify-center h-full px-6 text-center select-none pointer-events-none">
      <div className="space-y-12 max-w-4xl">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-headline font-bold">
            {currentSection.label}
          </span>
          <div className="h-px w-12 bg-primary/30 mx-auto" />
        </div>

        <div className="space-y-6">
          {currentSection.lines.map((line, lIdx) => (
            <div 
              key={lIdx} 
              className={cn(
                "transition-all duration-700",
                activeLineIndex === lIdx ? "opacity-100 scale-100" : "opacity-20 scale-95 blur-sm"
              )}
            >
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {line.words.map((wordObj, wIdx) => {
                  const isActive = currentTime >= wordObj.start;
                  const isCurrent = isActive && (line.words[wIdx+1] ? currentTime < line.words[wIdx+1].start : true);
                  
                  return (
                    <span
                      key={wIdx}
                      className={cn(
                        "font-headline uppercase font-bold tracking-tight transition-all duration-300",
                        currentSection.type === 'hook' ? "text-5xl md:text-7xl" : "text-4xl md:text-6xl",
                        isActive ? "text-white" : "text-white/10",
                        isCurrent && "glow-text scale-110",
                        wordObj.accent && isActive && "text-secondary glow-text-secondary animate-pulse-glow"
                      )}
                    >
                      {wordObj.word}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
