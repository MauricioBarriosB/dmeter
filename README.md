# DMETER - React + TypeScript + Vite

- Analyze audio input from your microphone with real-time decibel monitoring. Track current, peak, average, and range dB values while viewing a live frequency spectrum visualization.
- DMeter also include features for calculate room acoustics with professional RT60, speech intelligibility metrics, and frequency-dependent analysis for audio engineers and acoustic consultants.
- All analysis sessions are automatically saved for review and comparison.

[https://mauriciobarriosb.github.io/dmeter](https://mauriciobarriosb.github.io/dmeter)

## Features:

### Audio Meter:

- Web Audio API - Captures microphone input with disabled echo cancellation, noise suppression, and auto gain for accurate readings
- audiomotion-analyzer - Shows a real-time spectrum visualization with rainbow gradient, LED bars, and peak detection
- Real-time panel - Displays Current dB, Peak dB, Average dB, Min dB, and Max dB with color-coded chips
- localStorage persistence - All analysis records are saved and persist across browser sessions
- History table - Shows all previous analyses with date, duration, and all dB values
- Delete functionality - Delete individual records or clear all history

### Space Acoustics (Professional):

- **12 Room Types** - Recording studio, control room, broadcast, home theater, classroom, conference, auditorium, and more
- **Multi-Surface Materials** - 17 material options with per-surface selection (floor, ceiling, walls)
- **Environmental Factors** - Temperature, humidity, and occupancy calculations
- **Frequency-Dependent RT60** - Analysis at 6 octave bands (125Hz to 4kHz)
- **Speech Intelligibility** - STI estimation, C50, C80, D50 metrics
- **Professional Metrics** - EDT, Bass Ratio, Critical Distance, Mean Free Path
- **Room Modes Analysis** - Axial modes with Schroeder frequency threshold
- **Intelligent Recommendations** - Acoustic treatment suggestions based on analysis

## How to Use Meter:

1. **Navigate to Meter** - Go to the Meter page using the navigation menu.
2. **Start Analysis** - Press "Start Analysis" to request microphone permission and begin recording.
3. **While Recording** - See live spectrum and real-time dB values updating as you capture audio.
4. **Finish Analysis** - Press "Finish Analysis" to stop recording and save to history.

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

---

## Space Acoustics (Professional)

Professional room acoustic analysis designed for audio engineers and acoustic consultants. Features multi-surface materials, environmental factors, and frequency-dependent calculations.

### How to Use Space Acoustics:

1. **Configure Room** - Enter room dimensions (Length x Width x Height), select room type (e.g., Recording Studio, Control Room, Classroom) and ceiling style (Flat, Vault, Curved, etc.)
2. **Select Materials** - Choose materials for floor, ceiling, and walls from 17 acoustic options. Each surface can have different materials with frequency-dependent absorption coefficients.
3. **Set Environment** - Adjust temperature (affects speed of sound), humidity (affects air absorption), occupancy (people absorption), and number of windows/doors.
4. **View Results** - Real-time calculations update automatically as you modify parameters. Review RT60, speech intelligibility metrics, room modes, and intelligent recommendations.

### Room Configuration:

**12 Room Types:**

- Recording Studio, Control Room, Broadcast Studio
- Home Theater, Classroom, Conference Room
- Auditorium, Concert Hall, Rehearsal Room
- Parlor, Reading Room, Library

**6 Ceiling Types:**

- Flat, Vault, Rectangular, Pyramidal, Curved, Coffered

### Multi-Surface Materials (17 Options):

| Category           | Materials                                                                              |
| ------------------ | -------------------------------------------------------------------------------------- |
| Hard Surfaces      | Concrete, Brick, Plaster, Ceramic Tile, Glass                                          |
| Wood               | Wood Paneling, Wood Floor                                                              |
| Soft Materials     | Carpet (Thin), Carpet (Heavy), Curtains (Light/Heavy)                                  |
| Acoustic Treatment | Acoustic Tile, Acoustic Foam, Acoustic Panel, Fabric Panel, Perforated Panel, Diffuser |

Each surface (floor, ceiling, walls) can have different materials with frequency-dependent absorption coefficients at 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, and 4kHz.

### Environmental Factors:

- **Temperature** - Affects speed of sound: c = 331.3 + 0.606 × T (m/s)
- **Humidity** - Affects air absorption at high frequencies
- **Occupancy** - People absorption (~0.5 m² Sabins per person)
- **Windows/Doors** - Glass and door absorption calculated separately

### Reverberation Time (RT60):

- **Sabine RT60** - Classic formula: RT60 = 0.161 × V / A
- **Eyring RT60** - More accurate for absorptive rooms: RT60 = 0.161 × V / (-S × ln(1-α))
- **Frequency-Dependent** - RT60 calculated at 6 octave bands
- **Optimal Range Comparison** - Status indicator (Optimal/Too Dry/Too Reverberant)

### Speech Intelligibility Metrics:

| Metric  | Description                           | Good Value |
| ------- | ------------------------------------- | ---------- |
| **STI** | Speech Transmission Index (estimated) | ≥ 0.60     |
| **C50** | Speech Clarity (dB)                   | ≥ 2 dB     |
| **C80** | Music Clarity (dB)                    | 0-6 dB     |
| **D50** | Definition (%)                        | ≥ 50%      |

### Advanced Acoustic Parameters:

- **EDT (Early Decay Time)** - Perceptually relevant decay measurement
- **Bass Ratio** - RT60(low)/RT60(mid) for warmth assessment
- **Mean Free Path** - Average distance between reflections (4V/S)
- **Critical Distance** - Where direct sound equals reverberant sound
- **Schroeder Frequency** - Modal to diffuse field transition

### Room Modes Analysis:

Calculate axial room modes that can cause uneven bass response:

- **Length Modes** - f = nc / 2L (n = 1, 2, 3...)
- **Width Modes** - f = nc / 2W
- **Height Modes** - f = nc / 2H

Modes below the Schroeder frequency are flagged as potentially problematic.

### Optimal RT60 by Room Purpose:

| Room Type        | Min RT60 | Ideal RT60 | Max RT60 |
| ---------------- | -------- | ---------- | -------- |
| Recording Studio | 0.2s     | 0.3s       | 0.4s     |
| Control Room     | 0.25s    | 0.3s       | 0.4s     |
| Broadcast Studio | 0.3s     | 0.4s       | 0.5s     |
| Home Theater     | 0.3s     | 0.4s       | 0.5s     |
| Classroom        | 0.4s     | 0.5s       | 0.7s     |
| Conference Room  | 0.4s     | 0.5s       | 0.7s     |
| Rehearsal Room   | 0.4s     | 0.6s       | 0.8s     |
| Auditorium       | 1.0s     | 1.2s       | 1.5s     |
| Concert Hall     | 1.5s     | 1.8s       | 2.2s     |

### Intelligent Recommendations:

The analysis provides automatic recommendations based on:

- RT60 status relative to optimal range
- Speech intelligibility scores
- Bass ratio (warmth/brightness)
- Modal region issues
