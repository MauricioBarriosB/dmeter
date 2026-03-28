# DMETER - React + TypeScript + Vite

- Professional audio file analysis with FFT spectrum, LUFS loudness, stereo correlation, and mastering recommendations for 96+ genres and 65+ distribution formats.
- Analyze audio input from your microphone with real-time decibel monitoring. Track current, peak, average, and range dB values while viewing a live frequency spectrum visualization.
- Calculate room acoustics with professional RT60, speech intelligibility metrics, and frequency-dependent analysis for audio engineers and acoustic consultants.
- Generate comprehensive materials reports for building professional acoustic spaces with 12 build types and 59 materials across 8 categories.
- Create instrument lists for musical ensembles with 12 ensemble types, 14 genres, and 100+ instruments across 8 categories.
- All analysis sessions and reports are automatically saved for review and comparison.
- All analyzed audio is neither saved nor stored in a database; once the analysis is complete, the audio is completely detached from the application.

[https://mauriciobarriosb.github.io/dmeter](https://mauriciobarriosb.github.io/dmeter)

---

# Audio File Analysis Features

Professional audio file analysis for mastering engineers and music producers. Upload audio files and get comprehensive frequency spectrum, loudness metrics, stereo analysis, and distribution-specific recommendations.

### Supported Audio Formats:

- MP3, WAV, OGG, FLAC, AAC, M4A
- Maximum file size: 50MB
- Uses Web Audio API for high-quality decoding

### 96+ Music Genres:

| Category       | Genres                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Rock & Metal   | Rock, Hard Rock, Progressive, Alternative, Indie, Punk, Grunge, Metal variants |
| Pop & Dance    | Pop, Synth Pop, Electro Pop, K-Pop, J-Pop, Dance Pop                           |
| Electronic     | EDM, House, Techno, Trance, Dubstep, Drum & Bass, Ambient, Synthwave           |
| Hip Hop/Urban  | Hip Hop, Trap, Drill, Lo-Fi, Boom Bap, R&B, Neo Soul, Funk, Disco              |
| Jazz & Blues   | Jazz, Smooth Jazz, Bebop, Fusion, Blues, Delta Blues, Chicago Blues            |
| Classical      | Classical, Baroque, Romantic, Orchestral, Opera, Film Score, Video Game Music  |
| Country & Folk | Country, Americana, Bluegrass, Folk, Indie Folk, Celtic                        |
| World          | Reggae, Latin, Salsa, Reggaeton, Bossa Nova, Flamenco, Afrobeat                |

### 65+ Media Distribution Formats:

| Distribution Type     | Formats                                                                        |
| --------------------- | ------------------------------------------------------------------------------ |
| Physical Distribution | CD, Vinyl 12"/7"/10", Cassette, MiniDisc, SACD, DVD-Audio, Blu-ray, DAT        |
| Platform / Streaming  | Spotify, Apple Music, YouTube, Tidal, Amazon Music, Deezer, SoundCloud, TikTok |
| Digital Download      | WAV 16/24/32-bit, FLAC, ALAC, MP3, AAC, OGG, Opus, DSD64/128/256, MQA          |
| Broadcast             | FM/AM Radio, Digital Radio, TV Broadcast, Cinema, Podcast, Audiobook           |
| Sync / Media          | Film, TV Series, Documentary, Commercials, Video Games, Corporate, E-Learning  |
| Live / Performance    | Live PA, Club/DJ, Festival, Concert Hall, Arena, Theater, House of Worship     |

### Frequency Spectrum Analysis:

- **Custom FFT Algorithm** - 8192-point Cooley-Tukey radix-2 FFT with Hanning window
- **Averaged Spectrum** - Multiple overlapping windows for accurate representation
- **Frequency Response Chart** - SVG visualization with logarithmic frequency scale (20Hz-20kHz)
- **Octave Band Analysis** - 10 bands: 31.5Hz, 63Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 16kHz

### Spectral Metrics:

| Metric            | Description                                     |
| ----------------- | ----------------------------------------------- |
| Spectral Centroid | Center of mass - indicates perceived brightness |
| Spectral Rolloff  | Frequency below which 85% of energy exists      |
| Spectral Flatness | Tonal (0%) to noise-like (100%) ratio           |
| Spectral Spread   | Standard deviation around centroid              |
| Spectral Skewness | Asymmetry of spectrum distribution              |
| Spectral Kurtosis | Peakedness of spectrum                          |

### Frequency Balance Analysis:

| Band       | Range      | Description             |
| ---------- | ---------- | ----------------------- |
| Sub-bass   | 20-60 Hz   | Rumble, sub frequencies |
| Bass       | 60-250 Hz  | Kick, bass instruments  |
| Low-mid    | 250-500 Hz | Body, warmth            |
| Mid        | 500-2 kHz  | Vocals, instruments     |
| Upper-mid  | 2-4 kHz    | Presence, clarity       |
| Presence   | 4-6 kHz    | Definition, attack      |
| Brilliance | 6-20 kHz   | Air, sparkle, harmonics |

### Loudness Metrics (Professional Standards):

| Metric         | Description                                    |
| -------------- | ---------------------------------------------- |
| Peak dB        | Maximum sample amplitude                       |
| True Peak      | Inter-sample peak detection                    |
| RMS dB         | Average loudness level                         |
| LUFS           | Integrated loudness (EBU R128 / ITU-R BS.1770) |
| Loudness Range | LRA - dynamic variation in loudness            |
| Dynamic Range  | Difference between peak and average            |
| PSR            | Peak to Short-term Loudness Ratio              |
| Headroom       | Distance from 0 dBFS                           |
| Clipping %     | Percentage of clipped samples                  |

### Platform LUFS Targets:

| Platform     | Target LUFS  | Notes                  |
| ------------ | ------------ | ---------------------- |
| Spotify      | -14 LUFS     | Normalization enabled  |
| Apple Music  | -16 LUFS     | Sound Check            |
| YouTube      | -14 LUFS     | Loudness normalization |
| Tidal        | -14 LUFS     | Reference level        |
| TV Broadcast | -23/-24 LUFS | EBU R128 / ATSC A/85   |
| Cinema       | -24 LUFS     | Dolby reference        |
| Podcast      | -16 LUFS     | Speech optimized       |
| CD (Loud)    | -9 LUFS      | No normalization       |
| Vinyl        | -14 LUFS     | Physical limitations   |

### Stereo Analysis:

| Metric             | Description                                |
| ------------------ | ------------------------------------------ |
| Stereo Correlation | Phase coherence (-1 to +1, ideal: 0.5-1.0) |
| Stereo Width       | Perceived stereo image (0-100%)            |
| L/R Peak Balance   | Individual channel peak levels             |
| L/R RMS Balance    | Individual channel average levels          |
| Phase Coherence    | Overall phase relationship                 |

### Temporal Analysis:

| Metric          | Description                                 |
| --------------- | ------------------------------------------- |
| Duration        | File length in minutes:seconds.milliseconds |
| Sample Rate     | Hz (44.1kHz, 48kHz, 96kHz, etc.)            |
| Bit Depth       | 16-bit, 24-bit, 32-bit float                |
| Channels        | Mono, Stereo                                |
| Estimated BPM   | Tempo detection via onset analysis          |
| BPM Confidence  | Reliability of tempo estimate               |
| Transient Count | Number of detected transients               |
| Zero Crossing   | Signal characteristic analysis              |

### Harmonic Analysis:

- **Fundamental Frequency** - Detected via autocorrelation
- **Harmonic Series** - First 8 harmonics with magnitudes
- **THD Estimate** - Total Harmonic Distortion percentage
- **Noise Floor** - Background noise level estimation

### Genre-Specific Mastering Targets:

| Genre Category | LUFS Range | Dynamic Range | Description                   |
| -------------- | ---------- | ------------- | ----------------------------- |
| Metal          | -10 to -6  | 4-8 dB        | Aggressive, wall of sound     |
| Rock           | -12 to -9  | 6-10 dB       | Punchy, controlled dynamics   |
| Pop/Electronic | -12 to -8  | 6-10 dB       | Polished, commercial loudness |
| Hip Hop        | -11 to -8  | 5-9 dB        | Hard-hitting, bass-forward    |
| Jazz           | -18 to -12 | 10-18 dB      | Preserve natural dynamics     |
| Classical      | -24 to -16 | 12-25 dB      | Maximum dynamic range         |
| Ambient        | -20 to -14 | 12-20 dB      | Gentle, spacious              |
| Spoken Word    | -19 to -14 | 8-14 dB       | Clear, consistent speech      |

### Professional Recommendations:

The analysis provides automatic recommendations based on:

- LUFS comparison to platform targets
- Dynamic range assessment for genre
- Stereo correlation warnings (phase issues)
- Clipping and true peak alerts
- Frequency balance suggestions
- Headroom recommendations

---

# Audio Meter Features

- Web Audio API - Captures microphone input with disabled echo cancellation, noise suppression, and auto gain for accurate readings
- audiomotion-analyzer - Shows a real-time spectrum visualization with rainbow gradient, LED bars, and peak detection
- Real-time panel - Displays Current dB, Peak dB, Average dB, Min dB, and Max dB with color-coded chips
- Data Base persistence - All analysis records are saved and persist across browser sessions
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

| Category     | Count | Instruments                                                                         |
| ------------ | ----- | ----------------------------------------------------------------------------------- |
| Rock & Metal | 25    | Electric/Lead/Rhythm Guitars, Bass, Drum Kit components, Amplifiers, Pedals         |
| Strings      | 11    | Violin, Viola, Cello, Double Bass, Acoustic/Classical Guitar, Harp, Banjo, Mandolin |
| Woodwinds    | 7     | Flute, Clarinet, Oboe, Bassoon, Saxophone, Recorder, Piccolo                        |
| Brass        | 6     | Trumpet, Trombone, French Horn, Tuba, Cornet, Euphonium                             |
| Percussion   | 15    | Drum Kit, Timpani, Xylophone, Marimba, Vibraphone, Congas, Bongos, Cajon            |
| Keyboards    | 6     | Piano, Organ, Synthesizer, Electric Piano, Harpsichord, Accordion                   |
| Electronic   | 6     | Drum Machine, Sampler, DJ Mixer, Turntable, Effects Processor, MIDI Controller      |
| Ethnic       | 28    | Sitar, Tabla, Erhu, Koto, Djembe, Kalimba, Didgeridoo, Oud, Bouzouki, Bagpipes      |

### Report Management:

| Feature            | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| Create & Edit      | Generate new instrument reports or edit existing ones with form validation |
| Persistent Storage | All reports automatically saved to Data Base across browser sessions       |
| History & Review   | View complete report history with ensemble type, genre, and instruments    |
| Delete & Clear     | Remove individual reports or clear entire history with confirmation        |

---

# Project File Structure

```
dmeter/
├── public/                          # Static assets
│   ├── 404.html
│   └── vite.svg
├── src/
│   ├── assets/                      # App assets (images, icons)
│   ├── components/                  # Shared/global components
│   │   ├── ApiErrorNotification.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Layout.tsx
│   │   ├── LoadErrorCard.tsx
│   │   ├── LoadingCard.tsx
│   │   └── UnauthorizedAlert.tsx
│   ├── modules/                     # Feature modules
│   │   ├── acoustics/               # Space Acoustics module
│   │   │   ├── components/
│   │   │   ├── helpers/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── types/
│   │   ├── audio/                   # Audio File Analysis module
│   │   │   ├── components/
│   │   │   ├── helpers/
│   │   │   ├── pages/
│   │   │   └── types/
│   │   ├── contact/                 # Contact page module
│   │   │   └── pages/
│   │   ├── home/                    # Home/landing page module
│   │   │   ├── components/
│   │   │   └── pages/
│   │   ├── instruments/             # Instruments module
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── types/
│   │   ├── materials/               # Materials module
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── types/
│   │   ├── meter/                   # Audio Meter module
│   │   │   ├── components/
│   │   │   ├── helpers/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── types/
│   │   └── user/                    # User auth module
│   │       ├── components/
│   │       ├── context/
│   │       ├── hooks/
│   │       ├── pages/
│   │       └── types/
│   ├── services/                    # API services & config
│   │   ├── apiAuth.ts
│   │   ├── apiConfig.ts
│   │   ├── apiCrud.ts
│   │   └── licenseValidator.ts
│   ├── types/                       # Global type declarations
│   ├── App.tsx                      # Root component with routing
│   ├── index.css                    # Global styles (Tailwind)
│   └── main.tsx                     # App entry point
├── .env                             # Environment variables
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
├── tsconfig.app.json                # TypeScript config (app)
├── tsconfig.node.json               # TypeScript config (node)
└── vite.config.ts                   # Vite configuration
```

---

# Build & Development

### Prerequisites

- Node.js (v18+)
- npm

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root with the required variables (see `env.example` for reference).

### Development Server

```bash
npm run dev
```

Starts the Vite dev server with hot module replacement.

### Production Build

```bash
npm run build
```

Runs TypeScript type-checking (`tsc -b`) and then builds the app with Vite. Output goes to the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Serves the `dist/` folder locally to preview the production build.

### Linting & Formatting

```bash
npm run lint       # Run ESLint
npm run format     # Run Prettier
```

### Tech Stack

- **React 19** + **TypeScript 5.9**
- **Vite 7** — build tool & dev server
- **Tailwind CSS 4** — utility-first styling
- **HeroUI** — component library
- **Framer Motion** — animations
- **React Router DOM 7** — client-side routing
- **Axios** — HTTP client
- **audiomotion-analyzer** — real-time audio spectrum visualization
