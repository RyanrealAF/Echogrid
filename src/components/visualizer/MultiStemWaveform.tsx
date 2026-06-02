/**
 * @fileOverview Multi-stem stacked waveform display with unique motion profiles.
 */
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { WAVEFORM_DATA, StemType, SONG_METADATA, SongSection } from '@/lib/song-data';
import { cn } from '@/lib/utils';

interface MultiStemWaveformProps {
  isPlaying: boolean;
  currentSection: SongSection | null;
}

const STEM_CONFIG: Record<StemType, { label: string, color: string, motion: string }> = {
  drums: { label: 'DRUMS', color: 'bg-[#00FFFF]', motion: 'animate-pulse-sharp' },
  bass: { label: 'BASS', color: 'bg-[#A855F7]', motion: 'animate-breathe' },
  vocals: { label: 'VOCALS', color: 'bg-[#60A5FA]', motion: 'animate-shimmer-smooth' },
  melody: { label: 'MELODY', color: 'bg-[#F472B6]', motion: 'animate-shimmer-smooth' },
  harmonies: { label: 'HARMS', color: 'bg-[#34D399]', motion: 'animate-shimmer-smooth' },
  fx: { label: 'FX_PROC', color: 'bg-[#FBBF24]', motion: 'animate-wobble' },
};

export function MultiStemWaveform({ isPlaying, currentSection }: MultiStemWaveformProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stems = Object.keys(WAVEFORM_DATA) as StemType[];

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col p-4 gap-2 overflow-hidden">
      {stems.map((stem) => {
        const config = STEM_CONFIG[stem];
        const data = WAVEFORM_DATA[stem];

        return (
          <div key={stem} className="flex-1 flex items-center gap-4 group/stem relative">
            {/* Stem Label */}
            <div className="w-16 shrink-0 z-20">
              <span className="text-[8px] font-black tracking-widest text-white/40 uppercase group-hover/stem:text-white/80 transition-colors">
                {config.label}
              </span>
            </div>

            {/* Waveform Visualization */}
            <div className="flex-1 h-full flex items-center gap-[2px] relative">
              {data.map((val, i) => {
                const animationDelay = `${i * 0.05}s`;
                const height = isPlaying ? `${val * 100}%` : '4px';

                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 min-w-[2px] rounded-full transition-all duration-500",
                      config.color,
                      isPlaying && config.motion
                    )}
                    style={{
                      height: height,
                      opacity: isPlaying ? 0.8 : 0.2,
                      animationDelay: isPlaying ? animationDelay : '0s'
                    }}
                  />
                );
              })}
            </div>

            {/* Inset Border for hardware look */}
            <div className="absolute inset-0 border border-white/[0.02] pointer-events-none" />
          </div>
        );
      })}

      {/* Global Scanline Effect for Waveforms */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:100%_4px] opacity-20" />
    </div>
  );
}
