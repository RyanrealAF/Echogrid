/**
 * @fileOverview Speaker-aware lyrics overlay for LOVE IN THE RUIN.
 * Displays one line at a time with expressive typography.
 */
"use client";

import React, { useMemo } from 'react';
import { SongSection } from '@/lib/song-data';
import { cn } from '@/lib/utils';

interface LyricsOverlayProps {
  currentTime: number;
  currentSection: SongSection | null;
}

const SPEAKER_STYLES = {
  female: {
    font: 'font-light italic',
    color: 'text-[#A5F3FC]', // Cool blue
    glow: 'shadow-[#A5F3FC]/50',
    transition: 'duration-1000'
  },
  male: {
    font: 'font-black uppercase',
    color: 'text-[#FCD34D]', // Warm amber
    glow: 'shadow-[#FCD34D]/50',
    transition: 'duration-500'
  },
  sample: {
    font: 'font-normal tracking-widest uppercase opacity-40 blur-[0.5px]',
    color: 'text-[#C4A484]', // Vintage sepia
    glow: 'shadow-[#C4A484]/30',
    transition: 'duration-1500'
  }
};

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

  const speakerStyle = SPEAKER_STYLES[currentSection.speaker] || SPEAKER_STYLES.sample;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center select-none pointer-events-none z-30">
      <div className="max-w-7xl relative">
        {currentSection.lines.map((line, lIdx) => (
          <div 
            key={lIdx} 
            className={cn(
              "absolute inset-0 flex flex-wrap justify-center items-center gap-x-6 gap-y-4 transition-all",
              speakerStyle.transition,
              activeLineIndex === lIdx
                ? "opacity-100 translate-y-0 scale-100 blur-0"
                : "opacity-0 translate-y-12 scale-95 blur-md"
            )}
          >
            {line.words.map((wordObj, wIdx) => {
              const isActive = currentTime >= wordObj.start;
              const isCurrent = isActive && (line.words[wIdx+1] ? currentTime < line.words[wIdx+1].start : true);
              const isAccent = wordObj.accent;

              return (
                <span
                  key={wIdx}
                  className={cn(
                    "transition-all duration-300 transform inline-block leading-tight",
                    speakerStyle.font,
                    isActive ? speakerStyle.color : "text-white/5",
                    currentSection.speaker === 'female' ? "text-5xl md:text-7xl" : "text-6xl md:text-8xl",
                    isCurrent && "scale-110",
                    isCurrent && isAccent && "glow-text brightness-150 -translate-y-2",
                    isAccent && "underline decoration-primary/30 underline-offset-8"
                  )}
                >
                  {wordObj.word}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Ambient Section Marker */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-10">
        <span className="text-[9px] font-black tracking-[1.5em] text-white uppercase">
          // {currentSection.speaker}_VOX_ENGAGED
        </span>
      </div>
    </div>
  );
}
