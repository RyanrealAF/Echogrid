/**
 * @fileOverview Production-grade audio transport and sequencer controller.
 */
"use client";

import React, { useState, useEffect } from 'react';
import { Play, Pause, Music, Activity, Waves, Mic2, Disc, Sparkles } from 'lucide-react';
import { STEMS, StemType } from '@/lib/song-data';
import { cn } from '@/lib/utils';
import * as Tone from 'tone';

interface AudioControllerProps {
  onTimeUpdate: (time: number) => void;
  onStateChange: (isPlaying: boolean) => void;
  onRegenerate: () => void;
  totalDuration: number;
}

const STEM_CONFIG: Record<StemType, { label: string, icon: any, color: string }> = {
  vocals: { label: 'VOCALS', icon: Mic2, color: 'hsl(var(--primary))' },
  drums: { label: 'DRUMS', icon: Activity, color: 'hsl(var(--accent))' },
  bass: { label: 'BASS', icon: Waves, color: 'hsl(var(--secondary))' },
  melody: { label: 'MELODY', icon: Music, color: 'hsl(var(--primary))' },
  harmonies: { label: 'HARMS', icon: Disc, color: 'hsl(var(--accent))' },
  fx: { label: 'FX_PROC', icon: Sparkles, color: 'hsl(var(--secondary))' },
};

export function AudioController({ onTimeUpdate, onStateChange, onRegenerate, totalDuration }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSteps, setActiveSteps] = useState<Record<string, boolean[]>>({});
  
  // Initialize deterministic sequencer grid
  useEffect(() => {
    const grid: Record<string, boolean[]> = {};
    STEMS.forEach(s => {
      grid[s] = Array.from({ length: 32 }, (_, i) => i % (s === 'drums' ? 4 : 8) === 0);
    });
    setActiveSteps(grid);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      Tone.getTransport().start();
      interval = setInterval(() => {
        const time = Tone.getTransport().seconds;
        if (time >= totalDuration) {
          handleStop();
        } else {
          setCurrentTime(time);
          onTimeUpdate(time);
        }
      }, 50);
    } else {
      Tone.getTransport().pause();
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration, onTimeUpdate]);

  const handleStop = () => {
    setIsPlaying(false);
    onStateChange(false);
    Tone.getTransport().stop();
    setCurrentTime(0);
    onTimeUpdate(0);
  };

  const togglePlay = async () => {
    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    onStateChange(nextPlaying);
  };

  const toggleStep = (stem: string, index: number) => {
    setActiveSteps(prev => ({
      ...prev,
      [stem]: prev[stem].map((v, i) => i === index ? !v : v)
    }));
  };

  return (
    <div className="relative z-20 bg-[#0C0B0E] border-t-2 border-white/5 pb-8 transition-colors duration-1000">
      {/* Master Timecode Bar */}
      <div className="h-[3px] w-full bg-white/5 relative overflow-hidden">
        <div 
          className="absolute h-full wavie-gradient transition-all duration-100" 
          style={{ width: `${(currentTime / totalDuration) * 100}%` }}
        />
      </div>

      <div className="max-w-[1600px] mx-auto flex items-center gap-12 px-10 pt-10">
        {/* Master Control Unit */}
        <div className="relative group cursor-pointer shrink-0" onClick={togglePlay}>
          <div className={cn(
            "w-32 h-32 rounded-full bg-[#1A181F] border-[8px] border-[#2A272E] flex items-center justify-center shadow-2xl transition-all duration-700 relative",
            isPlaying ? "border-primary/40 shadow-[0_0_60px_rgba(255,128,0,0.2)]" : "grayscale opacity-80"
          )}>
            <div className="w-20 h-20 rounded-full bg-[#111014] flex items-center justify-center border border-white/5">
              {isPlaying ? <Pause className="text-white w-8 h-8" /> : <Play className="text-white w-8 h-8 ml-1 fill-current" />}
            </div>
            
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-1 h-3 bg-white/10 rounded-full"
                style={{ transform: `rotate(${i * 45}deg) translateY(-54px)` }}
              />
            ))}

            <div className={cn(
              "absolute top-2 w-2 h-4 bg-primary rounded-full transition-transform duration-1000 shadow-[0_0_15px_rgba(255,128,0,0.8)]",
              isPlaying ? "rotate-[180deg]" : "rotate-0"
            )} />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-white/30 tracking-widest uppercase">Master_Gain</div>
        </div>

        {/* Multi-Track Sequencer */}
        <div className="flex-1 flex flex-col gap-2">
          {STEMS.map((stemId) => {
            const config = STEM_CONFIG[stemId];
            const Icon = config.icon;
            const steps = activeSteps[stemId] || [];
            return (
              <div key={stemId} className="flex items-center gap-6 h-8 group">
                <div className="w-24 text-[9px] font-black tracking-[0.2em] text-white/30 flex items-center gap-3 transition-colors group-hover:text-white/70">
                  <Icon className="w-3 h-3 text-white/20 group-hover:text-primary transition-colors" />
                  {config.label}
                </div>
                <div className="flex-1 h-full sequencer-grid rounded-sm flex items-center px-2 gap-1.5 border border-white/5 bg-black/40">
                  {steps.map((isTriggered, i) => {
                    const progress = i / 32;
                    const isPassed = progress < (currentTime / totalDuration);
                    return (
                      <div 
                        key={i}
                        onClick={() => toggleStep(stemId, i)}
                        className={cn(
                          "h-[75%] w-full rounded-[1px] transition-all duration-300 cursor-pointer hover:brightness-150",
                          isTriggered ? "shadow-[0_0_10px_rgba(255,128,0,0.1)]" : "bg-white/[0.02]"
                        )}
                        style={{ 
                          backgroundColor: isTriggered ? (isPassed && isPlaying ? config.color : 'rgba(255,255,255,0.2)') : 'transparent',
                          opacity: isPassed ? 1 : 0.4,
                          transform: isTriggered && isPassed && isPlaying ? 'scaleY(1.2)' : 'scaleY(1)'
                        }}
                      />
                    );
                  })}
                </div>
                {/* VU Meter Emulation */}
                <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "flex-1 rounded-[1px] transition-all duration-300",
                        isPlaying && isTriggeredAt(currentTime, totalDuration, i) ? (i > 4 ? "bg-primary" : "bg-secondary") : "bg-white/5"
                      )} 
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary Console Modules */}
        <div className="w-56 grid grid-cols-2 gap-4">
          <div className="bg-[#1A181F] p-4 rounded-md border border-white/5 flex flex-col gap-2 cursor-pointer hover:border-secondary/20 transition-all">
            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">DRY_WET</span>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-secondary/80" />
            </div>
          </div>
          <div className="bg-[#1A181F] p-4 rounded-md border border-white/5 flex flex-col gap-2 cursor-pointer hover:border-primary/20 transition-all">
            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">LITR_PROC</span>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[40%] bg-primary/80" />
            </div>
          </div>
          <button 
            onClick={onRegenerate}
            className="col-span-2 bg-primary/10 p-3 rounded-md border border-primary/30 text-center hover:bg-primary/20 active:scale-95 transition-all group"
          >
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em] group-hover:glow-orange transition-all">SYNC_REGEN_SCENE</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function isTriggeredAt(time: number, duration: number, index: number) {
  // Simple deterministic simulation for the VU meter
  const phase = (time / duration) * 32;
  return Math.abs(Math.sin(phase + index)) > 0.5;
}
