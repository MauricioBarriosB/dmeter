import type { AcousticsRecord } from "./analysisStorage";

// Frequency bands for analysis (Hz)
export const FREQ_BANDS = [125, 250, 500, 1000, 2000, 4000] as const;
export type FrequencyBand = (typeof FREQ_BANDS)[number];

// Frequency-dependent absorption coefficients by material
export const materialAbsorption: Record<string, Record<FrequencyBand, number>> = {
    concrete: { 125: 0.01, 250: 0.01, 500: 0.02, 1000: 0.02, 2000: 0.02, 4000: 0.03 },
    brick: { 125: 0.03, 250: 0.03, 500: 0.03, 1000: 0.04, 2000: 0.05, 4000: 0.07 },
    plaster: { 125: 0.02, 250: 0.02, 500: 0.03, 1000: 0.04, 2000: 0.05, 4000: 0.05 },
    wood_panel: { 125: 0.15, 250: 0.11, 500: 0.10, 1000: 0.07, 2000: 0.06, 4000: 0.07 },
    wood_floor: { 125: 0.15, 250: 0.11, 500: 0.10, 1000: 0.07, 2000: 0.06, 4000: 0.07 },
    carpet_thin: { 125: 0.05, 250: 0.10, 500: 0.20, 1000: 0.30, 2000: 0.40, 4000: 0.50 },
    carpet_thick: { 125: 0.10, 250: 0.20, 500: 0.40, 1000: 0.55, 2000: 0.60, 4000: 0.65 },
    tile: { 125: 0.01, 250: 0.01, 500: 0.02, 1000: 0.02, 2000: 0.02, 4000: 0.02 },
    glass: { 125: 0.35, 250: 0.25, 500: 0.18, 1000: 0.12, 2000: 0.07, 4000: 0.04 },
    curtain_light: { 125: 0.05, 250: 0.10, 500: 0.20, 1000: 0.30, 2000: 0.40, 4000: 0.45 },
    curtain_heavy: { 125: 0.15, 250: 0.35, 500: 0.55, 1000: 0.70, 2000: 0.70, 4000: 0.65 },
    acoustic_tile: { 125: 0.50, 250: 0.70, 500: 0.75, 1000: 0.80, 2000: 0.80, 4000: 0.75 },
    acoustic_foam: { 125: 0.10, 250: 0.25, 500: 0.55, 1000: 0.80, 2000: 0.90, 4000: 0.85 },
    acoustic_panel: { 125: 0.30, 250: 0.70, 500: 0.85, 1000: 0.85, 2000: 0.80, 4000: 0.75 },
    fabric_panel: { 125: 0.20, 250: 0.45, 500: 0.75, 1000: 0.85, 2000: 0.80, 4000: 0.75 },
    perforated: { 125: 0.40, 250: 0.80, 500: 0.90, 1000: 0.80, 2000: 0.50, 4000: 0.35 },
    diffuser: { 125: 0.15, 250: 0.25, 500: 0.40, 1000: 0.50, 2000: 0.55, 4000: 0.60 },
};

// Person absorption (seated)
export const personAbsorption: Record<FrequencyBand, number> = {
    125: 0.25, 250: 0.35, 500: 0.42, 1000: 0.46, 2000: 0.50, 4000: 0.50
};

// Air absorption coefficient (m^-1) at 20C, 50% humidity
export const airAbsorption: Record<FrequencyBand, number> = {
    125: 0.0, 250: 0.0, 500: 0.001, 1000: 0.002, 2000: 0.005, 4000: 0.012
};

// Optimal RT60 by room purpose
export const optimalRT60: Record<string, { min: number; max: number; ideal: number }> = {
    recording_studio: { min: 0.2, max: 0.4, ideal: 0.3 },
    control_room: { min: 0.25, max: 0.4, ideal: 0.3 },
    broadcast: { min: 0.3, max: 0.5, ideal: 0.4 },
    rehearsal: { min: 0.4, max: 0.8, ideal: 0.6 },
    concert: { min: 1.5, max: 2.2, ideal: 1.8 },
    home_theater: { min: 0.3, max: 0.5, ideal: 0.4 },
    classroom: { min: 0.4, max: 0.7, ideal: 0.5 },
    conference: { min: 0.4, max: 0.7, ideal: 0.5 },
    auditorium: { min: 1, max: 1.5, ideal: 1.2 },
    parlor: { min: 0.8, max: 1.2, ideal: 1 },
    reading: { min: 0.3, max: 0.6, ideal: 0.4 },
    library: { min: 0.4, max: 0.7, ideal: 0.5 },
};

// Labels
export const purposeLabels: Record<string, string> = {
    recording_studio: "Recording Studio",
    control_room: "Control Room",
    broadcast: "Broadcast Studio",
    rehearsal: "Rehearsal Room",
    concert: "Concert Hall",
    home_theater: "Home Theater",
    classroom: "Classroom",
    conference: "Conference Room",
    auditorium: "Auditorium",
    parlor: "Parlor",
    reading: "Reading Room",
    library: "Library",
};

export const roofLabels: Record<string, string> = {
    flat: "Flat", vault: "Vault", rectangular: "Rectangular",
    pyramidal: "Pyramidal", curved: "Curved", coffered: "Coffered",
};

export const materialLabels: Record<string, string> = {
    concrete: "Concrete/Painted", brick: "Brick (Unglazed)", plaster: "Plaster/Gypsum",
    wood_panel: "Wood Paneling", wood_floor: "Wood Floor", carpet_thin: "Carpet (Thin)",
    carpet_thick: "Carpet (Heavy)", tile: "Ceramic Tile", glass: "Glass",
    curtain_light: "Curtains (Light)", curtain_heavy: "Curtains (Heavy)",
    acoustic_tile: "Acoustic Ceiling Tile", acoustic_foam: "Acoustic Foam",
    acoustic_panel: "Acoustic Panel", fabric_panel: "Fabric-wrapped Panel",
    perforated: "Perforated Panel", diffuser: "Diffuser Panel",
};

export const roofVolumeMultiplier: Record<string, number> = {
    flat: 1, vault: 1.15, rectangular: 1, pyramidal: 0.85, curved: 1.1, coffered: 0.95,
};

// Type aliases
export type RT60Status = "optimal" | "too_dry" | "too_reverberant";
export type ChipColor = "success" | "warning" | "danger";

// Interfaces
export interface FrequencyMetrics {
    rt60Sabine: number;
    rt60Eyring: number;
    totalAbsorption: number;
}

export interface AcousticMetrics {
    volume: number;
    surfaceArea: number;
    floorArea: number;
    wallArea: number;
    ceilingArea: number;
    speedOfSound: number;
    frequencyMetrics: Record<number, FrequencyMetrics>;
    rt60Mid: number;
    optimalRT60Range: { min: number; max: number; ideal: number };
    rt60Status: RT60Status;
    meanFreePath: number;
    criticalDistance: number;
    schroederFrequency: number;
    roomModes: { frequency: number; type: string; indices: string }[];
    c50: number;
    c80: number;
    d50: number;
    stiEstimate: number;
    bassRatio: number;
    edt: number;
}

export function getAbsorption(material: string, freq: number): number {
    return materialAbsorption[material]?.[freq as FrequencyBand] || 0.1;
}

interface RoomGeometry {
    height: number;
    width: number;
    depth: number;
    volume: number;
    floorArea: number;
    ceilingArea: number;
    wallArea: number;
    surfaceArea: number;
    effectiveWallArea: number;
    doorArea: number;
    windowArea: number;
    speedOfSound: number;
    humidityFactor: number;
    occupancy: number;
}

function parseRoomGeometry(record: AcousticsRecord): RoomGeometry {
    const height = Number.parseFloat(record.roomHeight) || 0;
    const width = Number.parseFloat(record.roomWidth) || 0;
    const depth = Number.parseFloat(record.roomDepth) || 0;
    const temp = Number.parseFloat(record.temperature) || 20;
    const humidity = Number.parseFloat(record.humidity) || 50;
    const occupancy = Number.parseFloat(record.occupancy) || 0;
    const windowArea = Number.parseFloat(record.windowArea) || 0;
    const doorCount = Number.parseFloat(record.doorCount) || 0;

    const speedOfSound = 331.3 + 0.606 * temp;
    const volumeMultiplier = roofVolumeMultiplier[record.roofType] || 1;
    const volume = height * width * depth * volumeMultiplier;
    const floorArea = width * depth;
    const ceilingArea = width * depth;
    const wallArea = 2 * (height * width + height * depth);
    const surfaceArea = floorArea + ceilingArea + wallArea;
    const doorArea = doorCount * 1.8;
    const effectiveWallArea = Math.max(0, wallArea - windowArea - doorArea);
    const humidityFactor = 1 + (50 - humidity) * 0.01;

    return {
        height, width, depth, volume, floorArea, ceilingArea, wallArea,
        surfaceArea, effectiveWallArea, doorArea, windowArea,
        speedOfSound, humidityFactor, occupancy,
    };
}

function calculateFrequencyMetricsForBand(
    freq: FrequencyBand,
    record: AcousticsRecord,
    geometry: RoomGeometry
): FrequencyMetrics {
    const { floorArea, ceilingArea, effectiveWallArea, windowArea, doorArea, volume, surfaceArea, humidityFactor, speedOfSound, occupancy } = geometry;

    const floorAlpha = getAbsorption(record.floorMaterial, freq);
    const ceilingAlpha = getAbsorption(record.ceilingMaterial, freq);
    const wallAlpha = getAbsorption(record.wallMaterial, freq);
    const glassAlpha = materialAbsorption.glass[freq];
    const doorAlpha = 0.15;

    const totalAbsorption =
        floorArea * floorAlpha +
        ceilingArea * ceilingAlpha +
        effectiveWallArea * wallAlpha +
        windowArea * glassAlpha +
        doorArea * doorAlpha +
        occupancy * personAbsorption[freq] +
        airAbsorption[freq] * humidityFactor * 4 * volume / speedOfSound;

    const avgAlpha = totalAbsorption / surfaceArea;
    const rt60Sabine = totalAbsorption > 0 ? (0.161 * volume) / totalAbsorption : 0;
    const eyringDenom = -surfaceArea * Math.log(1 - Math.min(avgAlpha, 0.99));
    const rt60Eyring = eyringDenom > 0 ? (0.161 * volume) / eyringDenom : 0;

    return { rt60Sabine, rt60Eyring, totalAbsorption };
}

function calculateRoomModes(geometry: RoomGeometry): { frequency: number; type: string; indices: string }[] {
    const { height, width, depth, speedOfSound } = geometry;
    const modes: { frequency: number; type: string; indices: string }[] = [];

    for (let n = 1; n <= 3; n++) {
        if (depth > 0) modes.push({ frequency: Math.round((n * speedOfSound) / (2 * depth)), type: "Axial (Length)", indices: `(${n},0,0)` });
        if (width > 0) modes.push({ frequency: Math.round((n * speedOfSound) / (2 * width)), type: "Axial (Width)", indices: `(0,${n},0)` });
        if (height > 0) modes.push({ frequency: Math.round((n * speedOfSound) / (2 * height)), type: "Axial (Height)", indices: `(0,0,${n})` });
    }

    modes.sort((a, b) => a.frequency - b.frequency);
    return modes.slice(0, 9);
}

function determineRT60Status(rt60Mid: number, optimalRange: { min: number; max: number }): RT60Status {
    if (rt60Mid < optimalRange.min) return "too_dry";
    if (rt60Mid > optimalRange.max) return "too_reverberant";
    return "optimal";
}

export function calculateAcousticMetrics(record: AcousticsRecord): AcousticMetrics {
    const geometry = parseRoomGeometry(record);
    const { volume, surfaceArea, floorArea, wallArea, ceilingArea, speedOfSound } = geometry;

    const frequencyMetrics: Record<number, FrequencyMetrics> = {};
    for (const freq of FREQ_BANDS) {
        frequencyMetrics[freq] = calculateFrequencyMetricsForBand(freq, record, geometry);
    }

    const rt60Mid = (frequencyMetrics[500].rt60Sabine + frequencyMetrics[1000].rt60Sabine) / 2;
    const optimalRange = optimalRT60[record.roomPurpose] || { min: 0.5, max: 1, ideal: 0.7 };
    const rt60Status = determineRT60Status(rt60Mid, optimalRange);

    const meanFreePath = surfaceArea > 0 ? (4 * volume) / surfaceArea : 0;
    const avgAbsorption = frequencyMetrics[1000].totalAbsorption / surfaceArea;
    const roomConstant = avgAbsorption > 0 ? (surfaceArea * avgAbsorption) / (1 - avgAbsorption) : 0;
    const criticalDistance = 0.057 * Math.sqrt(roomConstant);
    const schroederFrequency = volume > 0 ? 2000 * Math.sqrt(rt60Mid / volume) : 0;

    const edt = rt60Mid * 0.9;
    const c80 = 9.8 - 10 * Math.log10(Math.max(rt60Mid, 0.1));
    const c50 = 10.8 - 10 * Math.log10(Math.max(rt60Mid, 0.1));
    const d50 = 100 / (1 + Math.pow(10, -c50 / 10));
    const stiEstimate = Math.min(1, Math.max(0, 1 - 0.3 * Math.log10(Math.max(rt60Mid, 0.1))));

    const bassRT = frequencyMetrics[125].rt60Sabine + frequencyMetrics[250].rt60Sabine;
    const midRT = frequencyMetrics[500].rt60Sabine + frequencyMetrics[1000].rt60Sabine;
    const bassRatio = midRT > 0 ? bassRT / midRT : 1;

    return {
        volume, surfaceArea, floorArea, wallArea, ceilingArea, speedOfSound,
        frequencyMetrics, rt60Mid, optimalRT60Range: optimalRange, rt60Status,
        meanFreePath, criticalDistance, schroederFrequency,
        roomModes: calculateRoomModes(geometry),
        c50, c80, d50, stiEstimate, bassRatio, edt,
    };
}

export function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleString();
}

export function getBassRatioLabel(bassRatio: number): string {
    if (bassRatio > 1.1) return "Warm";
    if (bassRatio < 0.9) return "Bright";
    return "Balanced";
}

export function getStiLabel(sti: number): string {
    if (sti >= 0.75) return "Excellent";
    if (sti >= 0.6) return "Good";
    if (sti >= 0.45) return "Fair";
    return "Poor";
}

export function getC50Label(c50: number): string {
    if (c50 >= 2) return "Good";
    if (c50 >= -2) return "Acceptable";
    return "Poor";
}

export function getC80Label(c80: number): string {
    if (c80 >= 0 && c80 <= 6) return "Optimal";
    if (c80 > 6) return "Too Clear";
    return "Too Reverberant";
}

export function getRT60StatusLabel(status: RT60Status): string {
    if (status === "optimal") return "Optimal";
    if (status === "too_dry") return "Too Dry";
    return "Too Reverberant";
}

export function getRT60StatusColor(status: RT60Status): ChipColor {
    if (status === "optimal") return "success";
    if (status === "too_dry") return "warning";
    return "danger";
}

export function getStiColor(sti: number): ChipColor {
    if (sti >= 0.6) return "success";
    if (sti >= 0.45) return "warning";
    return "danger";
}

export function getC50Color(c50: number): ChipColor {
    if (c50 >= 2) return "success";
    if (c50 >= -2) return "warning";
    return "danger";
}

export function getC80Color(c80: number): ChipColor {
    if (c80 >= 0 && c80 <= 6) return "success";
    return "warning";
}
