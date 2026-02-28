# DMETER - React + TypeScript + Vite

APP for analyze audio input from your microphone with real-time decibel monitoring. Track current, peak, average, and range dB values while viewing a live frequency spectrum visualization. All analysis sessions are automatically saved for review and comparison.

[https://mauriciobarriosb.github.io/dmeter](https://mauriciobarriosb.github.io/dmeter) 

## Features:

- Web Audio API - Captures microphone input with disabled echo cancellation, noise suppression, and auto gain for accurate readings
- audiomotion-analyzer - Shows a real-time spectrum visualization with rainbow gradient, LED bars, and peak detection
- Real-time panel - Displays Current dB, Peak dB, Average dB, Min dB, and Max dB with color-coded chips
- localStorage persistence - All analysis records are saved and persist across browser sessions
- History table - Shows all previous analyses with date, duration, and all dB values
- Delete functionality - Delete individual records or clear all history

## Flow:

- Press Start analisis - Requests microphone permission, starts recording and visualization
- While recording - See live spectrum and real-time dB values updating
- Press Finish analisis - Stops recording, saves the analysis to history

## dB Color coding:

- Red (danger): >= -10 dB (very loud)
- Yellow (warning): >= -30 dB (loud)
- Green (success): >= -50 dB (moderate)
- Default: < -50 dB (quiet)
