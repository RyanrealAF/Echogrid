/**
 * @fileOverview Orchestration hub for the LOVE IN THE RUIN UI.
 * Reorganized into three functional layers: Section Header, Lyrics Display, and Multi-Stem Waveform.
 */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { SONG_METADATA } from '@/lib/song-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AudioController } from './AudioController';
import { LyricsOverlay } from './LyricsOverlay';
import { MultiStemWaveform } from './MultiStemWaveform';
import { ProductionMonitor } from './ProductionMonitor';
import { suggestVisualTreatmentsForProductionCue, SuggestVisualTreatmentsForProductionCueOutput } from '@/ai/flows/suggest-visual-treatments-for-production-cue';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SECTION_THEMES = {
  sample: {
    bg: 'bg-[#121212]',
    accent: 'text-[#5A7D9A]',
    label: 'text-[#5A7D9A]',
    glow: 'shadow-[#5A7D9A]/40'
  },
  hook: {
    bg: 'bg-[#2E004B]',
    accent: 'text-[#00FFFF]',
    label: 'text-[#00FFFF]',
    glow: 'shadow-[#00FFFF]/40'
  },
  verse: {
    bg: 'bg-[#2A2A2A]', // Dark gray for verse background
    accent: 'text-[#8B4513]',
    label: 'text-[#8B4513]',
    glow: 'shadow-[#8B4513]/40'
  },
  bridge: {
    bg: 'bg-[#1A1A2E]', // Deeper blue/purple for bridge
    accent: 'text-[#E6E6FA]',
    label: 'text-[#EEE8AA]',
    glow: 'shadow-[#EEE8AA]/40'
  },
  outro: {
    bg: 'bg-[#000000]',
    accent: 'text-[#008080]',
    label: 'text-[#008080]',
    glow: 'shadow-[#008080]/40'
  },
};

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

  const theme = useMemo(() => {
    if (!currentSection) return SECTION_THEMES.sample;
    return SECTION_THEMES[currentSection.type] || SECTION_THEMES.sample;
  }, [currentSection]);

  const fetchTreatment = useCallback(async (cueOverride?: string) => {
    const cue = cueOverride || currentSection?.production[0] || 'ambient_intro';
    setIsAiLoading(true);
    try {
      const result = await suggestVisualTreatmentsForProductionCue({ productionCue: cue });
      setAiTreatment(result);
    } catch (error) {
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
            <h1 className="text-5xl md:text-6xl font-black tracking-[1em] text-white uppercase glow-text ml-[1em]">LITR</h1>
            <p className="text-[10px] tracking-[0.6em] font-bold text-primary uppercase ml-[0.6em]">LOVE IN THE RUIN // UI_OS_1.0</p>
          </div>
          <Button
            onClick={() => setSessionStarted(true)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-black tracking-widest py-10 rounded-none border border-primary/40 shadow-[0_0_40px_rgba(255,128,0,0.25)] transition-all transform hover:scale-[1.02]"
          >
            INITIALIZE IMMERSION
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative h-screen w-full transition-colors duration-1000 overflow-hidden flex flex-col font-headline select-none",
      theme.bg
    )}>
      {/* Post-Processing Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {grainImage && (
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
            <Image
              src={grainImage.imageUrl}
              alt={grainImage.description}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] z-[100] bg-[length:100%_2px,3px_100%]" />
      </div>

      {/* Layer 1: Top Layer - Section Header */}
      <header className="relative z-50 flex justify-between items-center px-12 py-8 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex flex-col gap-1">
          <span className={cn("text-[10px] font-black tracking-[0.5em] uppercase opacity-50", theme.label)}>
            Current Section
          </span>
          <h2 className={cn("text-2xl font-black tracking-[0.2em] uppercase transition-all duration-700", theme.accent)}>
            {currentSection?.label || 'SYSTEM_IDLE'}
          </h2>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">
            {isPlaying ? 'STREAMING_ACTIVE' : 'STREAMING_PAUSED'}
          </span>
          <div className="flex items-center gap-4">
            <div className={cn("w-2 h-2 rounded-full", isPlaying ? "bg-primary animate-pulse" : "bg-white/20")} />
            <span className="text-xs font-mono text-white/60 tracking-widest">{currentTime.toFixed(3)}s</span>
          </div>
        </div>
      </header>

      {/* Main Container for Layers 2 and 3 */}
      <div className="relative flex-1 flex flex-col min-h-0">

        {/* Layer 2: Middle Layer - Lyric Line Display */}
        <section className="flex-[1.5] relative flex items-center justify-center overflow-hidden">
          <LyricsOverlay currentTime={currentTime} currentSection={currentSection} />
          {/* Subtle background pulse tied to theme */}
          <div className={cn(
            "absolute inset-0 opacity-10 blur-[120px] transition-all duration-1000",
            isPlaying && "animate-pulse"
          )} style={{ background: `radial-gradient(circle at center, currentColor 0%, transparent 70%)` }} />
        </section>

        {/* Layer 3: Bottom Layer - Multi-Stem Waveform */}
        <section className="flex-1 border-t border-white/5 bg-black/40 backdrop-blur-xl relative">
          <MultiStemWaveform isPlaying={isPlaying} currentSection={currentSection} />
        </section>

        {/* Floating Production Monitor (Unobtrusive) */}
        <div className="absolute right-0 top-0 bottom-0 pointer-events-none z-40 flex items-center">
            <div className="pointer-events-auto">
                {/* We'll keep it collapsed or minimal if needed, but for now using existing component */}
                {/* ProductionMonitor is already quite dense, maybe we can make it a slide-out */}
            </div>
        </div>
      </div>

      {/* Minimal Controls */}
      <AudioController 
        onTimeUpdate={setCurrentTime} 
        onStateChange={setIsPlaying}
        onRegenerate={() => fetchTreatment()}
        totalDuration={SONG_METADATA.duration}
      />
    </div>
  );
}
