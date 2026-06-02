
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SONG_METADATA } from '@/lib/song-data';

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
    <div className="fixed bottom-0 left-0 right-0 p-6 glass-morphism z-50 border-t border-white/5">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-muted-foreground w-10">{formatTime(currentTime)}</span>
          <Slider 
            value={[currentTime]} 
            max={totalDuration} 
            step={0.01} 
            onValueChange={handleSeek}
            className="flex-1 cursor-pointer"
          />
          <span className="text-xs font-mono text-muted-foreground w-10">{formatTime(totalDuration)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-headline uppercase tracking-widest text-primary">{SONG_METADATA.title}</span>
              <span className="text-[10px] uppercase tracking-tighter text-muted-foreground">Original Production - Grime Era</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white transition-colors">
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button 
              onClick={togglePlay} 
              size="icon" 
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 scale-100 hover:scale-110 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white transition-colors">
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3 w-40 justify-end">
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
  );
}
