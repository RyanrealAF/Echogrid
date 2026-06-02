/**
 * @fileOverview Main orchestration hub for the WAVIE Visualizer console.
 */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { SONG_METADATA, SongSection } from '@/lib/song-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AudioController } from './AudioController';
import { LyricsOverlay } from './LyricsOverlay';
import { IntegratedWaveform } from './IntegratedWaveform';
import { ProductionMonitor } from './ProductionMonitor';
import { suggestVisualTreatmentsForProductionCue, SuggestVisualTreatmentsForProductionCueOutput } from '@/ai/flows/suggest-visual-treatments-for-production-cue';
import { Button } from '@/components/ui/button';

export default function VisualizerShell() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiTreatment, setAiTreatment] = useState<SuggestVisualTreatmentsForProductionCueOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const currentSection = useMemo(() => {
    return SONG_METADATA.sections.find((s, idx) => {
      const nextStart = SONG_METADATA.sections[idx + 1]?.start || Infinity;
      return currentTime >= s.start && currentTime < nextStart;
    }) || null;
  }, [currentTime]);

  const fetchTreatment = useCallback(async (cueOverride?: string) => {
    const cue = cueOverride || currentSection?.production[0] || 'ambient_intro';
    setIsAiLoading(true);
    try {
      const result = await suggestVisualTreatmentsForProductionCue({ productionCue: cue });
      setAiTreatment(result);
    } catch (error) {
      // Fail gracefully with fallback defaults if AI is unavailable
      setAiTreatment({
        textualDescription: "Spectral analysis unavailable. Using default visual synthesis.",
        visualConcepts: ["Standard waveform rendering active.", "Hardware buffers initialized."],
        colorSuggestions: ["#FF8000", "#00F0FF", "#C04DFF"]
      });
    } finally {
      setIsAiLoading(false);
    }
  }, [currentSection]);

  useEffect(() => {
    if (currentSection && sessionStarted) {
      fetchTreatment();
    }
  }, [currentSection?.id, sessionStarted, fetchTreatment]);

  const grainImage = useMemo(() => PlaceHolderImages.find(img => img.id === 'grain-texture'), []);

  if (!sessionStarted) {
    return (
      <div className="h-screen w-full bg-[#08070B] flex items-center justify-center relative overflow-hidden font-headline">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent animate-pulse" />
        <div className="relative z-10 text-center space-y-10 max-w-lg px-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-[1em] text-white uppercase glow-text ml-[1em]">WAVIE</h1>
            <p className="text-[10px] tracking-[0.6em] font-bold text-primary uppercase ml-[0.6em]">Production Console V.1.0_STABLE</p>
          </div>
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm backdrop-blur-2xl space-y-6">
            <p className="text-xs text-white/40 tracking-widest leading-relaxed uppercase">
              Initializing spectral buffers... <br/>
              Ready for real-time creative synthesis.
            </p>
            <Button 
              onClick={() => setSessionStarted(true)}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black tracking-widest py-10 rounded-none border border-primary/40 shadow-[0_0_40px_rgba(255,128,0,0.25)] transition-all transform hover:scale-[1.02]"
            >
              INITIALIZE SESSION
            </Button>
          </div>
          <div className="flex justify-between items-center px-2 text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
            <span>SYSTEM_READY</span>
            <span>BPM_92</span>
            <span>STEMS_06</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-[#08070B] overflow-hidden flex flex-col font-headline select-none">
      {/* Immersive Post-Processing Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {grainImage && (
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
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
        {/* CRT Scanline and Vignette */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] z-[100] bg-[length:100%_2px,3px_100%]" />
        <div className="absolute inset-0 shadow-[inset_0_0_250px_rgba(0,0,0,0.9)]" />
      </div>

      {/* Top Engineering Nav */}
      <nav className="relative z-20 flex justify-between items-center px-10 py-6 border-b border-white/5 bg-black/60 backdrop-blur-xl text-[10px] tracking-[0.25em] font-bold text-white/40 uppercase">
        <div className="flex gap-10 items-center">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-sm border border-white/10 shadow-lg">
            <div className={cn("w-2 h-2 rounded-full bg-primary", isPlaying && "animate-pulse")} />
            <span className="text-white">LITR_92BPM</span>
          </div>
          <span className="hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-primary/50 py-1">INPUTS</span>
          <span className="hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-secondary/50 py-1 text-secondary">MONITOR</span>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <h1 className="text-2xl tracking-[0.7em] font-black text-white glow-text uppercase ml-[0.7em]">WAVIE</h1>
          <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-primary/40 to-transparent mt-2" />
        </div>

        <div className="flex gap-10">
          <div className="flex flex-col items-end opacity-60">
            <span className="text-white/80">L.RUIN_ENGINE</span>
            <span className="text-[8px] text-white/40">V.2.5_FLASH_STABLE</span>
          </div>
          <div className="bg-primary/10 text-primary border border-primary/30 px-5 py-2 rounded-sm text-[10px] font-black shadow-inner">
            SYNC_READY
          </div>
        </div>
      </nav>

      {/* Primary Workspace */}
      <div className="relative z-10 flex-1 flex">
        {/* Left Status Bar */}
        <aside className="w-16 border-r border-white/5 flex flex-col items-center py-12 gap-12 text-[8px] font-black text-white/10 uppercase [writing-mode:vertical-lr]">
          <span className="tracking-widest opacity-40">LEVEL_METER_OUT</span>
          <div className="flex-1 w-[1px] bg-white/5 mx-auto" />
          <span className="tracking-widest text-primary/40">PHASE_SYNC_CALIBRATED</span>
        </aside>

        {/* Center Hero Visualizer */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-12 left-12 text-[9px] font-black text-white/30 flex flex-col gap-2 z-30 tracking-widest uppercase">
            <span className="text-primary/70">Section: {currentSection?.label || 'SYS_IDLE'}</span>
            <span>Timecode: {currentTime.toFixed(3)}s</span>
            <span>Clock: {SONG_METADATA.bpm} BPM</span>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            <IntegratedWaveform isPlaying={isPlaying} />
            <LyricsOverlay currentTime={currentTime} currentSection={currentSection} />
          </div>
        </main>

        {/* Right Creative Monitor */}
        <ProductionMonitor 
          treatment={aiTreatment} 
          isLoading={isAiLoading} 
          onManualTrigger={() => fetchTreatment('beatdrop')}
        />
      </div>

      {/* Bottom Transport Console */}
      <AudioController 
        onTimeUpdate={setCurrentTime} 
        onStateChange={setIsPlaying}
        onRegenerate={() => fetchTreatment()}
        totalDuration={SONG_METADATA.duration}
      />
    </div>
  );
}
