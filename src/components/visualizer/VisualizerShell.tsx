"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { SONG_METADATA, SongSection } from '@/lib/song-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AudioController } from './AudioController';
import { LyricsOverlay } from './LyricsOverlay';
import { IntegratedWaveform } from './IntegratedWaveform';
import { ProductionMonitor } from './ProductionMonitor';
import { suggestVisualTreatmentsForProductionCue, SuggestVisualTreatmentsForProductionCueOutput } from '@/ai/flows/suggest-visual-treatments-for-production-cue';
import { cn } from '@/lib/utils';

export default function VisualizerShell() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiTreatment, setAiTreatment] = useState<SuggestVisualTreatmentsForProductionCueOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const currentSection = useMemo(() => {
    return SONG_METADATA.sections.find((s, idx) => {
      const nextStart = SONG_METADATA.sections[idx + 1]?.start || Infinity;
      return currentTime >= s.start && currentTime < nextStart;
    }) || null;
  }, [currentTime]);

  // Trigger AI Visual Treatment when section changes
  useEffect(() => {
    if (currentSection) {
      const fetchTreatment = async () => {
        setIsAiLoading(true);
        try {
          const cue = currentSection.production[0] || 'ambient';
          const result = await suggestVisualTreatmentsForProductionCue({ productionCue: cue });
          setAiTreatment(result);
        } catch (error) {
          console.error("AI Treatment Error:", error);
        } finally {
          setIsAiLoading(false);
        }
      };
      fetchTreatment();
    }
  }, [currentSection?.id]);

  const grainImage = useMemo(() => PlaceHolderImages.find(img => img.id === 'grain-texture'), []);

  return (
    <div className="relative h-screen w-full bg-[#08070B] overflow-hidden flex flex-col font-headline">
      {/* Immersive Background FX */}
      <div className="absolute inset-0 z-0">
        {grainImage && (
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay">
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
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%]" />
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.95)]" />
      </div>

      {/* Top Console Bar */}
      <nav className="relative z-20 flex justify-between items-center px-10 py-6 border-b border-white/5 bg-black/40 backdrop-blur-md text-[10px] tracking-[0.2em] font-bold text-white/40 uppercase">
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-sm border border-white/10">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-white">SESSION: LITR_92BPM</span>
          </div>
          <span className="hover:text-white transition-colors cursor-pointer">INPUTS</span>
          <span className="hover:text-white transition-colors cursor-pointer">MONITOR</span>
          <span className="text-primary/80">PROC_1.0</span>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <h1 className="text-2xl tracking-[0.6em] font-black text-white glow-text uppercase">WAVIE</h1>
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-1" />
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col items-end">
            <span className="text-white/60">L.RUI_SYSTEM</span>
            <span className="text-[8px] text-white/20">V.2.5_FLASH</span>
          </div>
          <div className="bg-primary/20 text-primary border border-primary/40 px-4 py-2 rounded-sm text-[10px] font-black">
            SYNC_READY
          </div>
        </div>
      </nav>

      {/* Main Production Workspace */}
      <div className="relative z-10 flex-1 flex">
        {/* Left Status Bar */}
        <aside className="w-16 border-r border-white/5 flex flex-col items-center py-10 gap-10 text-[8px] font-black text-white/10 uppercase [writing-mode:vertical-lr]">
          <span>LEVEL_METER</span>
          <div className="flex-1 w-[1px] bg-white/5" />
          <span>PHASE_CHECK</span>
        </aside>

        {/* Center Visualizer Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-10 left-10 text-[9px] font-black text-white/20 flex flex-col gap-1">
            <span className="text-primary">SECTION: {currentSection?.label || 'LOADING...'}</span>
            <span>TIMECODE: {currentTime.toFixed(3)}</span>
            <span>BPM: {SONG_METADATA.bpm}</span>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            <IntegratedWaveform isPlaying={isPlaying} />
            <LyricsOverlay currentTime={currentTime} currentSection={currentSection} />
          </div>
        </main>

        {/* Right AI Creative Treatment Panel */}
        <ProductionMonitor treatment={aiTreatment} isLoading={isAiLoading} />
      </div>

      {/* Bottom Sequencer Controller */}
      <AudioController 
        onTimeUpdate={setCurrentTime} 
        onStateChange={setIsPlaying}
        totalDuration={SONG_METADATA.duration}
      />
    </div>
  );
}
