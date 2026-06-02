"use client";

import React from 'react';
import { SuggestVisualTreatmentsForProductionCueOutput } from '@/ai/flows/suggest-visual-treatments-for-production-cue';
import { Sparkles, Activity, Palette, Zap, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductionMonitorProps {
  treatment: SuggestVisualTreatmentsForProductionCueOutput | null;
  isLoading: boolean;
  onManualTrigger: () => void;
}

export function ProductionMonitor({ treatment, isLoading, onManualTrigger }: ProductionMonitorProps) {
  return (
    <aside className="w-80 border-l border-white/5 bg-black/20 backdrop-blur-xl flex flex-col relative group/sidebar">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-primary" />
          Creative Treatment
        </h2>
        <button 
          onClick={onManualTrigger}
          disabled={isLoading}
          className="hover:rotate-180 transition-transform duration-500 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-3 h-3 text-secondary animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3 text-white/20 hover:text-white" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {/* Concept Description */}
        <div className={cn("space-y-3 transition-opacity duration-500", isLoading ? "opacity-30" : "opacity-100")}>
          <div className="flex items-center gap-2 text-[9px] font-bold text-primary tracking-widest uppercase">
            <Activity className="w-3 h-3" />
            Visual Concept
          </div>
          <p className="text-sm font-medium leading-relaxed text-white/70 italic min-h-[4em]">
            {treatment?.textualDescription || "Analyzing audio production cues for visual synthesis..."}
          </p>
        </div>

        {/* Animation Cues */}
        <div className={cn("space-y-4 transition-all duration-700", isLoading ? "opacity-30 translate-y-2" : "opacity-100 translate-y-0")}>
          <div className="text-[9px] font-bold text-white/30 tracking-widest uppercase">Visual Elements</div>
          <div className="space-y-3">
            {(treatment?.visualConcepts || ["Waiting for cue...", "Processing spectral data..."]).map((concept, i) => (
              <div key={i} className="flex gap-3 group/item">
                <div className="w-1 h-1 rounded-full bg-secondary mt-2 group-hover/item:scale-150 transition-transform" />
                <span className="text-xs text-white/50 leading-snug group-hover/item:text-white transition-colors">{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className={cn("space-y-3 transition-opacity duration-1000", isLoading ? "opacity-30" : "opacity-100")}>
          <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 tracking-widest uppercase">
            <Palette className="w-3 h-3" />
            LITR_Palette
          </div>
          <div className="flex gap-2">
            {(treatment?.colorSuggestions || ["#FF8000", "#00F0FF", "#C04DFF"]).map((color, i) => (
              <div 
                key={i} 
                className="flex-1 h-8 rounded-sm border border-white/10 shadow-lg cursor-help transition-transform hover:scale-105"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* System Stats Footer */}
      <div className="p-4 bg-black/40 border-t border-white/5">
        <div className="flex justify-between text-[8px] font-black text-white/20">
          <span>LATENCY: {isLoading ? 'PENDING' : '42MS'}</span>
          <span>GPU_LOAD: {isLoading ? '88%' : '18%'}</span>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
          <Zap className="w-8 h-8 text-primary animate-pulse" />
        </div>
      )}
    </aside>
  );
}
