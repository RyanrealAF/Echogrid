"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Repeat, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { SONG_METADATA } from '@/lib/song-data';
import { cn } from '@/lib/utils';

interface AudioControllerProps {
  onTimeUpdate: (time: number) => void;
  onStateChange: (isPlaying: boolean) => void;
  totalDuration: number;
}

export function AudioController({ onTimeUpdate, onStateChange, totalDuration }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
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
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, animate]);

  const togglePlay = () => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    onStateChange(nextPlaying);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    onTimeUpdate(newTime);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-8 glass-morphism z-50 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-6">
        {/* Progress Bar */}
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-mono text-primary font-bold w-12">{formatTime(currentTime)}</span>
          <Slider 
            value={[currentTime]} 
            max={totalDuration} 
            step={0.01} 
            onValueChange={handleSeek}
            className="flex-1 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-muted-foreground w-12 text-right">{formatTime(totalDuration)}</span>
        </div>

        {/* Controls Grid */}
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 bg-primary/20 rounded flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-colors">
              <Music className="w-6 h-6 text-primary glow-text" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-headline font-black uppercase tracking-widest text-white">{SONG_METADATA.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-tighter text-muted-foreground">Original Studio Master</span>
                <Badge variant="outline" className="h-4 text-[8px] bg-white/5 border-white/10 text-white/40">24-BIT</Badge>
              </div>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-8">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white transition-all hover:scale-110 active:scale-90">
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button 
              onClick={togglePlay} 
              size="icon" 
              className={cn(
                "w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform",
                isPlaying 
                  ? "bg-white text-black hover:bg-white/90 scale-100" 
                  : "bg-primary text-white hover:bg-primary/90 scale-110 hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
              )}
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 ml-1 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white transition-all hover:scale-110 active:scale-90">
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Utility Controls */}
          <div className="flex items-center gap-6 w-56 justify-end">
            <div className="flex items-center gap-3">
              <Repeat className="w-4 h-4 text-white/20 hover:text-white cursor-pointer transition-colors" />
              <Maximize2 className="w-4 h-4 text-white/20 hover:text-white cursor-pointer transition-colors" />
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider 
                value={[volume]} 
                max={100} 
                onValueChange={(v) => setVolume(v[0])}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}