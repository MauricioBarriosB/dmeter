# DMETER - React + TypeScript + Vite

APP to analyze audio input from your microphone with real-time decibel monitoring. Track current, peak, average, and range dB values while viewing a live frequency spectrum visualization. All analysis sessions are automatically saved for review and comparison.

[https://mauriciobarriosb.github.io/dmeter](https://mauriciobarriosb.github.io/dmeter)

## Features:

- Web Audio API - Captures microphone input with disabled echo cancellation, noise suppression, and auto gain for accurate readings
- audiomotion-analyzer - Shows a real-time spectrum visualization with rainbow gradient, LED bars, and peak detection
- Real-time panel - Displays Current dB, Peak dB, Average dB, Min dB, and Max dB with color-coded chips
- localStorage persistence - All analysis records are saved and persist across browser sessions
- History table - Shows all previous analyses with date, duration, and all dB values
- Delete functionality - Delete individual records or clear all history

## Flow:

- Go to the Meter page using the navigation menu to access the audio analysis tool.
- Press Start analisis - Requests microphone permission, starts recording and visualization
- While recording - See live spectrum and real-time dB values updating
- Press Finish analisis - Stops recording, saves the analysis to history

## dB Color coding:

- Red (danger): >= -10 dB (very loud)
- Yellow (warning): >= -30 dB (loud)
- Green (success): >= -50 dB (moderate)
- Default: < -50 dB (quiet)

## Advanced Metrics:

Access advanced metrics by clicking the Activity icon in the Analysis History table.

### Loudness Analysis:

- **Crest Factor** - Peak-to-average ratio in dB, indicates how "punchy" the audio is
- **Dynamic Range** - Difference between maximum and minimum dB levels
- **Loudness Classification** - Automatic categorization (Very Loud, Loud, Moderate, Quiet, Very Quiet)

### Spectral Analysis:

- **Spectral Centroid** - Center of mass of the spectrum, indicates perceived brightness (Dark → Warm → Balanced → Bright → Very Bright)
- **Spectral Rolloff (85%)** - Frequency below which 85% of the spectral energy exists
- **Spectral Flatness** - Ratio from 0% (tonal) to 100% (noise-like), helps distinguish between harmonic content and noise

### Frequency Band Distribution:

- **Low (20-250 Hz)** - Bass frequencies: kick drums, bass instruments
- **Mid (250-4000 Hz)** - Vocal range, most instruments, speech clarity
- **High (4000-20000 Hz)** - Presence, air, cymbal shimmer, sibilance

### Technical Summary Table:

Complete breakdown of all calculated metrics including Peak Level, Average Level (RMS), Min/Max Levels, Crest Factor, Dynamic Range, Spectral Centroid, Spectral Rolloff, and Spectral Flatness.
