"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { SONG_METADATA, STEMS } from '@/lib/song-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AudioController } from './AudioController';
import { WaveformStrip } from './WaveformStrip';
import { LyricsOverlay } from './LyricsOverlay';
import { suggestVisualTreatmentsForProductionCue, SuggestVisualTreatmentsForProductionCueOutput } from '@/ai/flows/suggest-visual-treatments-for-production-cue';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Activity, Info, LayoutGrid, Terminal } from 'lucide-react';

export default function VisualizerShell() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiTreatments, setAiTreatments] = useState<Record<string, SuggestVisualTreatmentsForProductionCueOutput>>({});

  const currentSection = useMemo(() => {
    return SONG_METADATA.sections.find((s, idx) => {
      const nextStart = SONG_METADATA.sections[idx + 1]?.start || Infinity;
      return currentTime >= s.start && currentTime < nextStart;
    }) || null;
  }, [currentTime]);

  const grainImage = useMemo(() => PlaceHolderImages.find(img => img.id === 'grain-texture'), []);

  useEffect(() => {
    if (currentSection && currentSection.production.length > 0) {
      const cue = currentSection.production[0];
      if (!aiTreatments[cue]) {
        suggestVisualTreatmentsForProductionCue({ productionCue: cue })
          .then(res => setAiTreatments(prev => ({ ...prev, [cue]: res })))
          .catch(console.error);
      }
    }
  }, [currentSection, aiTreatments]);

  const activeTreatment = currentSection ? aiTreatments[currentSection.production[0]] : null;

  return (
    <div className="relative h-screen w-full bg-[#0D0B10] overflow-hidden flex flex-col scanlines">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 vignette">
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-1000",
            currentSection?.type === 'hook' ? "bg-primary/10" : "bg-transparent"
          )} 
        />
        
        {grainImage && (
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay">
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
        
        {activeTreatment && isPlaying && (
          <div 
            className="absolute inset-0 blur-[180px] opacity-20 transition-all duration-2000"
            style={{ backgroundColor: activeTreatment.colorSuggestions[0] }}
          />
        )}

        {/* Global FX */}
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-pulse" />
      </div>

      {/* Main Console Layout */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* Top Header Bar */}
        <div className="p-8 flex justify-between items-center border-b border-white/5 glass-morphism">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-xl font-headline font-black uppercase tracking-[0.2em] text-white">
                Stem<span className="text-primary glow-text">Sculpt</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-primary/30 text-primary">v1.0.4-grime</Badge>
                <span className="text-[10px] text-muted-foreground font-mono">0x44A2_SEC_MONITOR</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8 pl-8 border-l border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                  <Activity className="w-3 h-3 text-primary" /> Signal
                </span>
                <span className="text-sm font-mono text-white">SEC_ACTIVE: {currentSection?.label.split('—')[0] || '---'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-secondary" /> Production
                </span>
                <span className="text-sm font-mono text-white uppercase">{currentSection?.production.join(' / ') || 'IDLE'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {activeTreatment && (
               <div className="hidden lg:flex flex-col items-end text-right glass-morphism p-3 rounded-lg border-primary/20 animate-in fade-in slide-in-from-right-4">
                  <span className="text-[9px] text-primary uppercase font-bold tracking-widest flex items-center gap-1">
                    <Info className="w-3 h-3" /> GenAI Visual Suggestion
                  </span>
                  <p className="text-[10px] text-white/80 italic leading-relaxed max-w-[200px] mt-1">
                    "{activeTreatment.textualDescription}"
                  </p>
               </div>
             )}
             <LayoutGrid className="w-5 h-5 text-white/20" />
          </div>
        </div>

        {/* Dynamic Lyrics Area */}
        <div className="flex-1 relative">
          <LyricsOverlay currentTime={currentTime} currentSection={currentSection} />
          
          {/* Subtle Side Stats */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 opacity-40">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] uppercase tracking-widest text-primary font-bold">Latency</span>
              <div className="w-12 h-0.5 bg-primary/20"><div className="w-2/3 h-full bg-primary" /></div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] uppercase tracking-widest text-secondary font-bold">Buffer</span>
              <div className="w-12 h-0.5 bg-secondary/20"><div className="w-full h-full bg-secondary" /></div>
            </div>
          </div>
        </div>

        {/* Stem Mixer Area */}
        <div className="px-8 pb-32">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-screen-xl mx-auto">
            {STEMS.map((stem) => (
              <WaveformStrip 
                key={stem} 
                stem={stem} 
                isActive={currentSection?.production.includes(stem) || stem === 'vocals' || stem === 'fx'} 
                isPlaying={isPlaying}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer Controller */}
      <AudioController 
        onTimeUpdate={setCurrentTime} 
        onStateChange={setIsPlaying}
        totalDuration={SONG_METADATA.duration}
      />
    </div>
  );
}
