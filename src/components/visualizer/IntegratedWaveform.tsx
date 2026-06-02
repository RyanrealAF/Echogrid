/**
 * @fileOverview Reactive integrated waveform that consumes AI creative treatments.
 */
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { WAVEFORM_DATA } from '@/lib/song-data';
import { SuggestVisualTreatmentsForProductionCueOutput } from '@/ai/flows/suggest-visual-treatments-for-production-cue';
import { cn } from '@/lib/utils';

interface IntegratedWaveformProps {
  isPlaying: boolean;
  treatment: SuggestVisualTreatmentsForProductionCueOutput | null;
}

export function IntegratedWaveform({ isPlaying, treatment }: IntegratedWaveformProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use AI suggested colors or fall back to brand defaults
  const colors = useMemo(() => {
    if (treatment?.colorSuggestions && treatment.colorSuggestions.length >= 3) {
      return treatment.colorSuggestions;
    }
    return ['#FF8000', '#00F0FF', '#C04DFF'];
  }, [treatment]);

  // Summate stems for a richer central visual
  const combinedData = useMemo(() => {
    const melody = WAVEFORM_DATA.melody;
    const drums = WAVEFORM_DATA.drums;
    const bass = WAVEFORM_DATA.bass;
    return melody.map((v, i) => (v + (drums[i] || 0.5) * 0.8 + (bass[i] || 0.3) * 1.2) / 2.5);
  }, []);

  return (
    <div className="absolute inset-0 w-full flex items-center justify-center gap-[3px] px-12 md:px-24 pointer-events-none overflow-hidden">
      {/* Background Glow reactive to AI Colors */}
      <div 
        className="absolute inset-0 transition-colors duration-2000 opacity-20 blur-[150px]"
        style={{ 
          background: `radial-gradient(circle at center, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)` 
        }}
      />

      {combinedData.map((val, i) => {
        const progress = i / combinedData.length;
        let color = colors[0];
        if (progress > 0.35) color = colors[1];
        if (progress > 0.70) color = colors[2];

        const heightScale = isPlaying ? 1.8 : 0.45;
        const animationDelay = `${i * 0.04}s`;

        return (
          <div key={i} className="flex flex-col items-center justify-center flex-1 min-w-[4px] gap-[2px] relative z-10">
             {/* Main Reactive Bar */}
            <div 
              className="w-full rounded-full transition-all duration-700 ease-out"
              style={{ 
                height: `${val * 320 * heightScale}px`,
                backgroundColor: color,
                boxShadow: isPlaying ? `0 0 50px ${color}cc` : `0 0 15px ${color}33`,
                opacity: isPlaying ? 0.9 : 0.3,
                animation: mounted && isPlaying ? `block-pulse 1.2s infinite ease-in-out ${animationDelay}` : 'none'
              }}
            />
            {/* 3D Reflection */}
            <div 
              className="w-full rounded-full transition-all duration-1000 opacity-10 blur-[4px]"
              style={{ 
                height: `${val * 140 * heightScale}px`,
                backgroundColor: color,
                transform: 'translateY(110%) scaleY(0.5)'
              }}
            />
          </div>
        );
      })}

      {/* Digital Floor Grid */}
      <div className="absolute w-full h-[1px] bg-white/[0.05] top-1/2 -translate-y-1/2 z-0" />
      
      {/* Dynamic Overlay FX based on Treatment Concepts */}
      {treatment?.visualConcepts.some(c => c.toLowerCase().includes('scratch') || c.toLowerCase().includes('dust')) && (
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-[1px] h-full bg-white/20 animate-vignette-flicker"
              style={{ 
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: '0.1s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
