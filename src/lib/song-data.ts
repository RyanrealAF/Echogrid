/**
 * @fileOverview Source of truth for song timing, lyrics, and deterministic waveform data.
 */

export interface Word {
  word: string;
  start: number;
  accent?: boolean;
}

export interface LyricLine {
  text: string;
  words: Word[];
}

export interface SongSection {
  id: string;
  label: string;
  type: 'hook' | 'verse' | 'bridge' | 'outro' | 'sample';
  speaker: 'male' | 'female' | 'sample';
  production: string[];
  start: number;
  lines: LyricLine[];
}

export interface SongMetadata {
  title: string;
  bpm: number;
  duration: number;
  sections: SongSection[];
}

export const SONG_METADATA: SongMetadata = {
  title: "LOVE IN THE RUIN",
  bpm: 92,
  duration: 24,
  sections: [
    {
      id: "intro_sample",
      label: "Intro — filtered vocal sample",
      type: "sample",
      speaker: "female",
      production: ["vinylcrackle", "helicopterdistant"],
      start: 0.0,
      lines: [
        {
          text: "\"...if I'm with you... then I'm with you...\"",
          words: [
            { word: "if", start: 2.10 },
            { word: "I'm", start: 2.25 },
            { word: "with", start: 2.40 },
            { word: "you...", start: 2.60 },
            { word: "then", start: 3.10 },
            { word: "I'm", start: 3.25 },
            { word: "with", start: 3.40 },
            { word: "you...", start: 3.60, accent: true }
          ]
        }
      ]
    },
    {
      id: "hook_1",
      label: "Hook — Female",
      type: "hook",
      speaker: "female",
      production: ["beatdrop", "pianoloop", "heavykick", "crispsnare"],
      start: 8.0,
      lines: [
        {
          text: "LOVE IN THE RUIN... Under liquor-store lights...",
          words: [
            { word: "LOVE", start: 8.00, accent: true },
            { word: "IN", start: 8.20 },
            { word: "THE", start: 8.32 },
            { word: "RUIN...", start: 8.50 },
            { word: "Under", start: 9.10 },
            { word: "liquor-store", start: 9.30 },
            { word: "lights...", start: 9.60 }
          ]
        },
        {
          text: "Cold rain fall on the avenue lines... Still you put your hand in mine...",
          words: [
            { word: "Cold", start: 10.10 },
            { word: "rain", start: 10.25 },
            { word: "fall", start: 10.40 },
            { word: "on", start: 10.55 },
            { word: "the", start: 10.65 },
            { word: "avenue", start: 10.80 },
            { word: "lines...", start: 11.00 },
            { word: "Still", start: 11.50 },
            { word: "you", start: 11.65 },
            { word: "put", start: 11.80 },
            { word: "your", start: 11.95 },
            { word: "hand", start: 12.10 },
            { word: "in", start: 12.25 },
            { word: "mine...", start: 12.40 }
          ]
        }
      ]
    }
  ]
};

export const STEMS = ["vocals", "drums", "bass", "melody", "harmonies", "fx"] as const;
export type StemType = typeof STEMS[number];

/**
 * Generates a deterministic array of values between 0.1 and 1.0.
 * Pure function to ensure hydration consistency.
 */
const generateDeterministicWaveform = (seed: number, length: number) => {
  return Array.from({ length }, (_, i) => {
    const val = Math.abs(Math.sin(seed * 1.5 + i * 0.72));
    return Number((val * 0.85 + 0.15).toFixed(2));
  });
};

export const WAVEFORM_DATA: Record<StemType, number[]> = {
  drums: generateDeterministicWaveform(101, 32),
  bass: generateDeterministicWaveform(202, 32),
  vocals: generateDeterministicWaveform(303, 32),
  melody: generateDeterministicWaveform(404, 32),
  harmonies: generateDeterministicWaveform(505, 32),
  fx: generateDeterministicWaveform(606, 32),
};
