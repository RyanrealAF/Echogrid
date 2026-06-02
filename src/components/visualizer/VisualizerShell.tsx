
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { SONG_METADATA, STEMS, SongSection } from '@/lib/song-data';
import { AudioController } from './AudioController';
import { WaveformStrip } from './WaveformStrip';
import { LyricsOverlay } from './LyricsOverlay';
import { suggestVisualTreatmentsForProductionCue, SuggestVisualTreatmentsForProductionCueOutput } from '@/ai/flows/suggest-visual-treatments-for-production-cue';
import { cn } from '@/lib/utils';

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

  // Handle AI Visual Enhancements when section changes
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
    <div className="relative h-screen w-full bg-background overflow-hidden flex flex-col">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0">
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-1000",
            currentSection?.type === 'hook' ? "bg-primary/5" : "bg-transparent"
          )} 
        />
        {/* Cinematic Grime Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://picsum.photos/seed/grain/1920/1080')] bg-repeat mix-blend-overlay" />
        
        {/* AI Suggested Background Color Pulsing */}
        {activeTreatment && isPlaying && (
          <div 
            className="absolute inset-0 blur-[150px] opacity-10 transition-colors duration-1000"
            style={{ backgroundColor: activeTreatment.colorSuggestions[0] }}
          />
        )}

        {/* Helicopter oscillation effect simulation */}
        {currentSection?.production.includes('helicopterdistant') && isPlaying && (
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-[80px] animate-pulse" />
        )}
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* Top Section Info */}
        <div className="p-8 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h1 className="text-sm font-headline uppercase tracking-[0.5em] text-primary glow-text">StemSculpt</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active Section</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
          
          <div className="flex flex-col items-end text-right gap-4">
             {activeTreatment && (
               <div className="max-w-xs transition-opacity duration-500">
                  <p className="text-[9px] text-primary uppercase font-bold tracking-widest mb-1">Visual Concept</p>
                  <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                    {activeTreatment.textualDescription}
                  </p>
               </div>
             )}
          </div>
        </div>

        {/* Center Lyrics */}
        <div className="flex-1">
          <LyricsOverlay currentTime={currentTime} currentSection={currentSection} />
        </div>

        {/* Waveform Visualization Sidebar/Bottom Area */}
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

      {/* Audio Control Panel */}
      <AudioController 
        onTimeUpdate={setCurrentTime} 
        onStateChange={setIsPlaying}
        totalDuration={20} // Just for the demo prototype
      />
    </div>
  );
}
