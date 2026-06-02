"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { SONG_METADATA } from '@/lib/song-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AudioController } from './AudioController';
import { LyricsOverlay } from './LyricsOverlay';
import { IntegratedWaveform } from './IntegratedWaveform';
import { cn } from '@/lib/utils';

export default function VisualizerShell() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSection = useMemo(() => {
    return SONG_METADATA.sections.find((s, idx) => {
      const nextStart = SONG_METADATA.sections[idx + 1]?.start || Infinity;
      return currentTime >= s.start && currentTime < nextStart;
    }) || null;
  }, [currentTime]);

  const grainImage = useMemo(() => PlaceHolderImages.find(img => img.id === 'grain-texture'), []);

  return (
    <div className="relative h-screen w-full bg-[#08070B] overflow-hidden flex flex-col font-headline">
      {/* Background FX */}
      <div className="absolute inset-0 z-0">
        {grainImage && (
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
            <Image
              src={grainImage.imageUrl}
              alt={grainImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={grainImage.imageHint}
            />
          </div>
        )}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
      </div>

      {/* Top Utility Bar */}
      <nav className="relative z-20 flex justify-between items-center px-10 py-6 border-b border-white/5 bg-black/20 text-[10px] tracking-[0.2em] font-bold text-white/40 uppercase">
        <div className="flex gap-8">
          <span className="text-white flex items-center gap-1"><span className="text-[14px] leading-none">+</span> SCAR</span>
          <span>JD</span>
          <span>JIE</span>
          <span className="text-white/80">15</span>
          <span>SALLIE</span>
        </div>
        <div className="flex gap-8">
          <span>NACO</span>
          <span>VANE</span>
          <span className="text-white/60">WRONG</span>
          <span>HOEL</span>
        </div>
        <div className="flex gap-8">
          <span className="bg-white/5 px-4 py-1.5 rounded-sm text-white/80">E.LEE</span>
          <span>ORY</span>
          <span>GEE</span>
          <span>LENFER</span>
        </div>
      </nav>

      {/* Sub-Nav Utility */}
      <div className="relative z-20 flex justify-center gap-6 py-3 text-[8px] tracking-[0.3em] font-black text-white/20 uppercase">
        <span>NARIA</span>
        <span>AUDIO</span>
        <span>INCENT</span>
        <span>MASTER</span>
      </div>

      {/* Hero Visualizer Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-10">
        <h1 className="text-xl tracking-[0.8em] font-black text-white/20 uppercase mb-4">WAVIE</h1>
        
        <div className="relative w-full h-[400px] flex items-center justify-center">
          <IntegratedWaveform isPlaying={isPlaying} />
          <LyricsOverlay currentTime={currentTime} currentSection={currentSection} />
        </div>
      </main>

      {/* Bottom Sequencer Controller */}
      <AudioController 
        onTimeUpdate={setCurrentTime} 
        onStateChange={setIsPlaying}
        totalDuration={SONG_METADATA.duration}
      />
    </div>
  );
}
