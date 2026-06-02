/**
 * @fileOverview AI-driven sidebar for creative treatments and metadata monitoring.
 */
"use client";

import React from 'react';
import { SuggestVisualTreatmentsForProductionCueOutput } from '@/ai/flows/suggest-visual-treatments-for-production-cue';
import { Sparkles, Activity, Palette, Zap, RefreshCw, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductionMonitorProps {
  treatment: SuggestVisualTreatmentsForProductionCueOutput | null;
  isLoading: boolean;
  onManualTrigger: () => void;
}

export function ProductionMonitor({ treatment, isLoading, onManualTrigger }: ProductionMonitorProps) {
  return (
    <aside className="w-80 border-l border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col relative group/sidebar shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
      <div className="p-7 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <h2 className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase flex items-center gap-3">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Creative_Treatment
        </h2>
        <button 
          onClick={onManualTrigger}
          disabled={isLoading}
          className="hover:rotate-180 transition-transform duration-700 disabled:opacity-30 p-1 rounded-sm hover:bg-white/5"
          title="Regenerate treatment"
        >
          {isLoading ? (
            <RefreshCw className="w-3.5 h-3.5 text-secondary animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5 text-white/20 hover:text-white" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
        {/* Visual Concept Synthesis */}
        <div className={cn("space-y-4 transition-all duration-700", isLoading ? "opacity-20 blur-sm" : "opacity-100 blur-0")}>
          <div className="flex items-center gap-2 text-[9px] font-bold text-primary tracking-[0.2em] uppercase">
            <Activity className="w-3 h-3" />
            Synthesis_Buffer
          </div>
          <p className="text-sm font-medium leading-relaxed text-white/80 italic border-l-2 border-primary/20 pl-4 py-1">
            {treatment?.textualDescription || "Calibrating spectral production cues..."}
          </p>
        </div>

        {/* Animation & Visual Elements */}
        <div className={cn("space-y-5 transition-all duration-1000", isLoading ? "opacity-20 translate-x-4" : "opacity-100 translate-x-0")}>
          <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase">
            <Layers className="w-3 h-3" />
            Visual_Elements
          </div>
          <div className="space-y-4">
            {(treatment?.visualConcepts || ["Buffer standby...", "Analyzing transient data..."]).map((concept, i) => (
              <div key={i} className="flex gap-4 group/item">
                <div className="w-[1px] h-4 bg-secondary/40 mt-1 group-hover/item:bg-secondary transition-colors" />
                <span className="text-[11px] text-white/50 leading-snug font-medium group-hover/item:text-white transition-colors">{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LITR Color Palette */}
        <div className={cn("space-y-4 transition-all duration-1000 delay-200", isLoading ? "opacity-20 scale-95" : "opacity-100 scale-100")}>
          <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase">
            <Palette className="w-3 h-3" />
            Spectral_Palette
          </div>
          <div className="flex gap-2.5">
            {(treatment?.colorSuggestions || ["#FF8000", "#00F0FF", "#C04DFF"]).map((color, i) => (
              <div 
                key={i} 
                className="flex-1 h-10 rounded-sm border border-white/5 shadow-2xl cursor-help transition-all hover:scale-110 hover:z-10"
                style={{ 
                  backgroundColor: color,
                  boxShadow: `0 0 20px ${color}22`
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="p-6 bg-black/60 border-t border-white/5 shadow-2xl">
        <div className="flex justify-between items-center text-[8px] font-black text-white/20 tracking-widest uppercase">
          <div className="flex flex-col gap-1">
            <span>Latency: {isLoading ? 'PENDING' : '14.2ms'}</span>
            <span>Jitter: 0.02ms</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span>GPU: {isLoading ? '92%' : '14%'}</span>
            <span>MEM: 12GB_SYNTH</span>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-10 transition-all duration-500">
          <div className="flex flex-col items-center gap-4">
            <Zap className="w-10 h-10 text-primary animate-pulse shadow-[0_0_30px_rgba(255,128,0,0.5)]" />
            <span className="text-[8px] font-black tracking-[0.5em] text-white/40 uppercase">Re_Synthesizing</span>
          </div>
        </div>
      )}
    </aside>
  );
}
