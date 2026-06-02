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
    <div className="flex flex-col items-center justify-center h-full px-6 text-center select-none pointer-events-none z-10">
      <div className="space-y-16 max-w-5xl">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-primary/20" />
            <span className="text-[11px] uppercase tracking-[0.5em] text-primary/80 font-headline font-black glow-text">
              {currentSection.label.split('—')[0]}
            </span>
            <div className="h-px w-16 bg-primary/20" />
          </div>
        </div>

        {/* Lyric Content */}
        <div className="space-y-12">
          {currentSection.lines.map((line, lIdx) => (
            <div 
              key={lIdx} 
              className={cn(
                "transition-all duration-1000 transform",
                activeLineIndex === lIdx 
                  ? "opacity-100 translate-y-0 scale-100 blur-0" 
                  : "opacity-10 translate-y-4 scale-95 blur-md"
              )}
            >
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
                {line.words.map((wordObj, wIdx) => {
                  const isActive = currentTime >= wordObj.start;
                  const isCurrent = isActive && (line.words[wIdx+1] ? currentTime < line.words[wIdx+1].start : true);
                  
                  return (
                    <span
                      key={wIdx}
                      className={cn(
                        "font-headline uppercase font-black tracking-tighter transition-all duration-500",
                        currentSection.type === 'hook' ? "text-6xl md:text-8xl" : "text-5xl md:text-7xl",
                        isActive ? "text-white" : "text-white/5",
                        isCurrent && "glow-text scale-110 translate-y-[-4px] animate-word-active",
                        wordObj.accent && isActive && "text-secondary glow-text-secondary brightness-125"
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
