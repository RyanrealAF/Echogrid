# StemSculpt Visualizer Blueprint

## Overview
StemSculpt is a high-fidelity, immersive music visualizer designed for the "cinematic grime" aesthetic. It breaks down tracks into individual stems (vocals, drums, bass, etc.) and uses generative AI to suggest visual concepts that react to production cues.

## Core Features
- **Stem-Based Waveforms**: Independent visualization for 6 distinct audio channels (vocals, drums, bass, melody, harmonies, fx).
- **AI Visual Treatments**: Integrates with Google Gemini via Genkit to suggest color palettes and textual visual concepts based on song section metadata (e.g., 'vinylcrackle', 'beatdrop').
- **Dynamic Lyrics Engine**: Time-synced lyrics with word-level highlighting and "Hook" vs "Verse" specific typography.
- **Cinematic Aesthetic**: Deep indigo background, luminous violet primary accents, cyan-blue secondary highlights, and a persistent grain overlay.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI/Styling**: React 19, Tailwind CSS, ShadCN UI
- **AI Architecture**: Genkit with `googleai/gemini-2.5-flash`
- **Animations**: CSS Keyframes + `requestAnimationFrame` for high-performance timing.

## Project Structure
- `src/components/visualizer/`: UI components for the player, lyrics, and waveforms.
- `src/ai/flows/`: Genkit flows for creative visual suggestions.
- `src/lib/song-data.ts`: Source of truth for song timing, lyrics, and deterministic waveform data.

## Implementation Details
- **Deterministic Waveforms**: To ensure hydration consistency, waveforms are generated using a sine-based pseudo-random algorithm.
- **Hydration Safety**: Dynamic random animations (like opacity pulsing) are deferred until after client-side mounting using `useEffect`.
