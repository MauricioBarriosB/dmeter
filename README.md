# DMETER - React + TypeScript + Vite

- Analyze audio input from your microphone with real-time decibel monitoring. Track current, peak, average, and range dB values while viewing a live frequency spectrum visualization.
- Calculate room acoustics with professional RT60, speech intelligibility metrics, and frequency-dependent analysis for audio engineers and acoustic consultants.
- Generate comprehensive materials reports for building professional acoustic spaces with 12 build types and 59 materials across 8 categories.
- Create instrument lists for musical ensembles with 12 ensemble types, 14 genres, and 100+ instruments across 8 categories.
- All analysis sessions and reports are automatically saved for review and comparison.

[https://mauriciobarriosb.github.io/dmeter](https://mauriciobarriosb.github.io/dmeter)

---

# Audio Meter Features

- Web Audio API - Captures microphone input with disabled echo cancellation, noise suppression, and auto gain for accurate readings
- audiomotion-analyzer - Shows a real-time spectrum visualization with rainbow gradient, LED bars, and peak detection
- Real-time panel - Displays Current dB, Peak dB, Average dB, Min dB, and Max dB with color-coded chips
- localStorage persistence - All analysis records are saved and persist across browser sessions
- History table - Shows all previous analyses with date, duration, and all dB values
- Delete functionality - Delete individual records or clear all history

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

# Space Acoustics Features

Professional room acoustic analysis designed for audio engineers and acoustic consultants. Features multi-surface materials, environmental factors, and frequency-dependent calculations.

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

---

# Materials Features

Generate comprehensive material lists for building audio studios, home studios, rehearsal rooms, and professional acoustic spaces. Choose from 12 build types and 59 specialized materials across 8 categories.

### 12 Build Types:

- Recording Studio, Home Studio, Rehearsal Room, Control Room
- Broadcast Studio, Podcast Room, Voiceover Booth, Mixing Room
- Mastering Suite, Live Room, Isolation Booth, Home Theater

### Acoustic Treatment (22 Materials)

| Category           | Count | Materials                                                                    |
| ------------------ | ----- | ---------------------------------------------------------------------------- |
| Absorption Panels  | 5     | Acoustic Foam, Fabric-Wrapped Panels, Wooden Slats, Perforated Wood, Fabric  |
| Bass Control       | 4     | Bass Traps, Corner Bass Traps, Helmholtz Resonators, Membrane Absorbers      |
| Diffusion          | 4     | Diffuser Panels, QRD Diffusers, Skyline Diffusers, Polycylindrical Diffusers |
| Ceiling & Portable | 9     | Ceiling Tiles, Cloud Panels, Baffles, Curtains, Gobos, Vocal Booth, more     |

### Construction & Soundproofing (37 Materials)

| Category          | Count | Materials                                                                          |
| ----------------- | ----- | ---------------------------------------------------------------------------------- |
| Wall Systems      | 12    | Concrete Blocks, Stud Walls, Plywood, MDF, Rockwool, Fiberglass, MLV, Green Glue   |
| Sealing & Opening | 10    | Acoustic Caulk, Sealants, Weatherstripping, Door Seals, Soundproof Doors, Glazing  |
| Floor & Vibration | 9     | Carpet Underlay, Rubber/Cork Flooring, Neoprene Pads, Spring Isolators, Drum Riser |
| Ceiling & HVAC    | 6     | Suspended Ceiling, Isolation Hangers, Duct Silencers, Flexible Duct, Ventilation   |

### 17 Surface Materials - Absorption Analysis:

#### Hard Surfaces (Low Absorption):

| Material         | Absorption Coefficient Range |
| ---------------- | ---------------------------- |
| Concrete/Painted | 0.01 - 0.03                  |
| Brick (Unglazed) | 0.03 - 0.07                  |
| Plaster/Gypsum   | 0.02 - 0.05                  |
| Ceramic Tile     | 0.01 - 0.02                  |
| Glass            | 0.04 - 0.35                  |

#### Wood & Fabric (Medium Absorption):

| Material         | Absorption Coefficient Range |
| ---------------- | ---------------------------- |
| Wood Paneling    | 0.06 - 0.15                  |
| Wood Floor       | 0.06 - 0.15                  |
| Carpet (Thin)    | 0.05 - 0.50                  |
| Carpet (Heavy)   | 0.10 - 0.65                  |
| Curtains (Light) | 0.05 - 0.45                  |
| Curtains (Heavy) | 0.15 - 0.70                  |

#### Acoustic Treatment (High Absorption):

| Material              | Absorption Coefficient Range |
| --------------------- | ---------------------------- |
| Acoustic Ceiling Tile | 0.50 - 0.80                  |
| Acoustic Foam         | 0.10 - 0.90                  |
| Acoustic Panel        | 0.30 - 0.85                  |
| Fabric-wrapped Panel  | 0.20 - 0.85                  |
| Perforated Panel      | 0.35 - 0.90                  |
| Diffuser Panel        | 0.15 - 0.60                  |

> Absorption coefficients vary by frequency (125Hz - 4kHz). Higher values indicate more sound absorption.

---

# Instruments Features

Generate comprehensive instrument lists for musical ensembles, bands, and orchestras. Select your ensemble type, genre, and choose from a wide variety of instruments.

### 12 Ensemble Types:

- Symphony Orchestra, Big Band, Jazz Quartet, String Quartet
- Rock Band, Choir, Chamber Orchestra, Wind Ensemble
- Brass Band, Marching Band, Pop/Electronic, World Music Ensemble

### 14 Musical Genres:

- Classical, Jazz, Rock, Pop, Blues, Country, Electronic
- Folk, R&B/Soul, Metal, Reggae, Latin, Hip Hop, World Music

### 100+ Instruments Across 8 Categories:

| Category      | Count | Instruments                                                                         |
| ------------- | ----- | ----------------------------------------------------------------------------------- |
| Rock & Metal  | 25    | Electric/Lead/Rhythm Guitars, Bass, Drum Kit components, Amplifiers, Pedals        |
| Strings       | 11    | Violin, Viola, Cello, Double Bass, Acoustic/Classical Guitar, Harp, Banjo, Mandolin |
| Woodwinds     | 7     | Flute, Clarinet, Oboe, Bassoon, Saxophone, Recorder, Piccolo                        |
| Brass         | 6     | Trumpet, Trombone, French Horn, Tuba, Cornet, Euphonium                             |
| Percussion    | 15    | Drum Kit, Timpani, Xylophone, Marimba, Vibraphone, Congas, Bongos, Cajon            |
| Keyboards     | 6     | Piano, Organ, Synthesizer, Electric Piano, Harpsichord, Accordion                   |
| Electronic    | 6     | Drum Machine, Sampler, DJ Mixer, Turntable, Effects Processor, MIDI Controller      |
| Ethnic        | 28    | Sitar, Tabla, Erhu, Koto, Djembe, Kalimba, Didgeridoo, Oud, Bouzouki, Bagpipes      |

### Report Management:

| Feature            | Description                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| Create & Edit      | Generate new instrument reports or edit existing ones with form validation  |
| Persistent Storage | All reports automatically saved to localStorage across browser sessions     |
| History & Review   | View complete report history with ensemble type, genre, and instruments     |
| Delete & Clear     | Remove individual reports or clear entire history with confirmation         |
