"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { STEMS, StemType } from '@/lib/song-data';
import { cn } from '@/lib/utils';

interface AudioControllerProps {
  onTimeUpdate: (time: number) => void;
  onStateChange: (isPlaying: boolean) => void;
  totalDuration: number;
}

export function AudioController({ onTimeUpdate, onStateChange, totalDuration }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const requestRef = useRef<number>(undefined);
  const startTimeRef = useRef<number>(0);

  const animate = useCallback((time: number) => {
    if (!isPlaying) return;
    const delta = (time - startTimeRef.current) / 1000;
    const newTime = Math.min(currentTime + delta, totalDuration);
    if (newTime >= totalDuration) {
      setIsPlaying(false);
      onStateChange(false);
      setCurrentTime(0);
      onTimeUpdate(0);
      return;
    }
    setCurrentTime(newTime);
    onTimeUpdate(newTime);
    startTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [isPlaying, currentTime, totalDuration, onTimeUpdate, onStateChange]);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, animate]);

  const togglePlay = () => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    onStateChange(nextPlaying);
  };

  const tracks: { id: string; label: string }[] = [
    { id: 'kick', label: 'KICK' },
    { id: 'snare', label: 'SNARE' },
    { id: 'hihat', label: 'HI-HAT' },
    { id: 'perc', label: 'PERC' },
  ];

  return (
    <div className="relative z-20 bg-[#0C0B0E] border-t-2 border-white/5 pb-10">
      {/* Master Progress Bar */}
      <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
        <div 
          className="absolute h-full wavie-gradient transition-all duration-100" 
          style={{ width: `${(currentTime / totalDuration) * 100}%` }}
        />
        <div className="absolute inset-0 flex justify-between px-10 -top-4 text-[8px] font-bold text-white/40">
          {[1,2,2,3,4,5,6,3].map((n, i) => <span key={i}>{n}</span>)}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex items-start gap-12 px-10 pt-12">
        {/* Master Control Knob */}
        <div className="relative group cursor-pointer" onClick={togglePlay}>
          <div className={cn(
            "w-28 h-28 rounded-full bg-[#1A181F] border-[6px] border-[#2A272E] flex items-center justify-center shadow-2xl transition-all duration-500",
            isPlaying ? "border-primary/60 shadow-[0_0_40px_rgba(255,128,0,0.2)]" : ""
          )}>
            <div className="w-16 h-16 rounded-full bg-[#111014] flex items-center justify-center">
              {isPlaying ? <Pause className="text-white w-6 h-6" /> : <Play className="text-white w-6 h-6 ml-1 fill-current" />}
            </div>
            {/* Orange Marker */}
            <div className={cn(
              "absolute top-2 w-1.5 h-3 bg-primary rounded-full transition-transform duration-1000",
              isPlaying ? "rotate-[180deg]" : "rotate-0"
            )} />
          </div>
          <div className="absolute inset-0 -m-2 rounded-full border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Sequencer Grid */}
        <div className="flex-1 flex flex-col gap-3">
          {tracks.map((track) => (
            <div key={track.id} className="flex items-center gap-6 h-8">
              <div className="w-20 text-[9px] font-black tracking-widest text-white/40 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                {track.label}
              </div>
              <div className="flex-1 h-full sequencer-grid rounded-sm flex items-center px-1 gap-1">
                {/* Simulated Pattern Blocks */}
                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "h-[80%] w-10 rounded-sm transition-all duration-500",
                      (i % (track.id === 'kick' ? 4 : 3) === 0) 
                        ? "bg-primary shadow-[0_0_10px_rgba(255,128,0,0.3)] animate-block" 
                        : "bg-white/5"
                    )}
                    style={{ opacity: (i / 24) < (currentTime / totalDuration) ? 1 : 0.3 }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Timeline Labels */}
          <div className="flex items-center gap-6 mt-2">
            <div className="w-20 text-[8px] font-bold text-white/10 uppercase tracking-widest">BK</div>
            <div className="flex-1 flex justify-between px-2 text-[9px] font-black text-white/20">
              {[1, 2, 4, 5, 6, 7, 8, 9, 10, 2].map((n, i) => <span key={i}>{n}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
