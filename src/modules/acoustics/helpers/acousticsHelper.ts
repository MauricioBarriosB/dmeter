import {
    FREQ_BANDS,
    type AcousticsRecord,
    type AcousticsConfig,
    type FrequencyAbsorption,
    type OptimalRT60,
    type RoomGeometry,
    type RT60Status,
    type ChipColor,
    type FrequencyBand,
    type FrequencyMetrics,
    type AcousticMetrics,
} from "../types";

// Re-export constant
export { FREQ_BANDS } from "../types";

// Helper to get absorption from config
function getAbsorption(config: AcousticsConfig, materialKey: string, freq: number): number {
    const material = config.materialOptions.find((m) => m.key === materialKey);
    if (!material) return 0.1;
    return material.absorption[freq.toString() as keyof FrequencyAbsorption] || 0.1;
}

// Helper to get optimal RT60 from config
function getOptimalRT60(config: AcousticsConfig, purposeKey: string): OptimalRT60 {
    const purpose = config.roomPurposeOptions.find((p) => p.key === purposeKey);
    return purpose?.optimalRT60 || { min: 0.5, max: 1, ideal: 0.7 };
}

// Helper to get volume multiplier from config
function getVolumeMultiplier(config: AcousticsConfig, roofKey: string): number {
    const roof = config.roofTypeOptions.find((r) => r.key === roofKey);
    return roof?.volumeMultiplier || 1;
}

// Helper to get label from config
export function getPurposeLabel(config: AcousticsConfig, key: string): string {
    return config.roomPurposeOptions.find((p) => p.key === key)?.label || key;
}

export function getRoofLabel(config: AcousticsConfig, key: string): string {
    return config.roofTypeOptions.find((r) => r.key === key)?.label || key;
}

export function getMaterialLabel(config: AcousticsConfig, key: string): string {
    return config.materialOptions.find((m) => m.key === key)?.label || key;
}

function parseRoomGeometry(record: AcousticsRecord, config: AcousticsConfig): RoomGeometry {
    const height = Number.parseFloat(record.roomHeight) || 0;
    const width = Number.parseFloat(record.roomWidth) || 0;
    const depth = Number.parseFloat(record.roomDepth) || 0;
    const temp = Number.parseFloat(record.temperature) || 20;
    const humidity = Number.parseFloat(record.humidity) || 50;
    const occupancy = Number.parseFloat(record.occupancy) || 0;
    const windowArea = Number.parseFloat(record.windowArea) || 0;
    const doorCount = Number.parseFloat(record.doorCount) || 0;

    const speedOfSound = 331.3 + 0.606 * temp;
    const volumeMultiplier = getVolumeMultiplier(config, record.roofType);
    const volume = height * width * depth * volumeMultiplier;
    const floorArea = width * depth;
    const ceilingArea = width * depth;
    const wallArea = 2 * (height * width + height * depth);
    const surfaceArea = floorArea + ceilingArea + wallArea;
    const doorArea = doorCount * 1.8;
    const effectiveWallArea = Math.max(0, wallArea - windowArea - doorArea);
    const humidityFactor = 1 + (50 - humidity) * 0.01;

    return {
        height,
        width,
        depth,
        volume,
        floorArea,
        ceilingArea,
        wallArea,
        surfaceArea,
        effectiveWallArea,
        doorArea,
        windowArea,
        speedOfSound,
        humidityFactor,
        occupancy,
    };
}

function calculateFrequencyMetricsForBand(
    freq: FrequencyBand,
    record: AcousticsRecord,
    geometry: RoomGeometry,
    config: AcousticsConfig,
): FrequencyMetrics {
    const {
        floorArea,
        ceilingArea,
        effectiveWallArea,
        windowArea,
        doorArea,
        volume,
        surfaceArea,
        humidityFactor,
        speedOfSound,
        occupancy,
    } = geometry;

    const floorAlpha = getAbsorption(config, record.floorMaterial, freq);
    const ceilingAlpha = getAbsorption(config, record.ceilingMaterial, freq);
    const wallAlpha = getAbsorption(config, record.wallMaterial, freq);
    const glassAlpha = getAbsorption(config, "glass", freq);
    const doorAlpha = config.doorAbsorption;

    const freqKey = freq.toString() as keyof FrequencyAbsorption;
    const personAbsorption = config.personAbsorption[freqKey] || 0.4;
    const airAbsorption = config.airAbsorption[freqKey] || 0;

    const totalAbsorption =
        floorArea * floorAlpha +
        ceilingArea * ceilingAlpha +
        effectiveWallArea * wallAlpha +
        windowArea * glassAlpha +
        doorArea * doorAlpha +
        occupancy * personAbsorption +
        (airAbsorption * humidityFactor * 4 * volume) / speedOfSound;

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
        if (depth > 0)
            modes.push({
                frequency: Math.round((n * speedOfSound) / (2 * depth)),
                type: "Axial (Length)",
                indices: `(${n},0,0)`,
            });
        if (width > 0)
            modes.push({
                frequency: Math.round((n * speedOfSound) / (2 * width)),
                type: "Axial (Width)",
                indices: `(0,${n},0)`,
            });
        if (height > 0)
            modes.push({
                frequency: Math.round((n * speedOfSound) / (2 * height)),
                type: "Axial (Height)",
                indices: `(0,0,${n})`,
            });
    }

    modes.sort((a, b) => a.frequency - b.frequency);
    return modes.slice(0, 9);
}

function determineRT60Status(rt60Mid: number, optimalRange: OptimalRT60): RT60Status {
    if (rt60Mid < optimalRange.min) return "too_dry";
    if (rt60Mid > optimalRange.max) return "too_reverberant";
    return "optimal";
}

export function calculateAcousticMetrics(record: AcousticsRecord, config: AcousticsConfig): AcousticMetrics {
    const geometry = parseRoomGeometry(record, config);
    const { volume, surfaceArea, floorArea, wallArea, ceilingArea, speedOfSound } = geometry;

    const frequencyMetrics: Record<number, FrequencyMetrics> = {};
    for (const freq of FREQ_BANDS) {
        frequencyMetrics[freq] = calculateFrequencyMetricsForBand(freq, record, geometry, config);
    }

    const rt60Mid = (frequencyMetrics[500].rt60Sabine + frequencyMetrics[1000].rt60Sabine) / 2;
    const optimalRange = getOptimalRT60(config, record.roomPurpose);
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
        volume,
        surfaceArea,
        floorArea,
        wallArea,
        ceilingArea,
        speedOfSound,
        frequencyMetrics,
        rt60Mid,
        optimalRT60Range: optimalRange,
        rt60Status,
        meanFreePath,
        criticalDistance,
        schroederFrequency,
        roomModes: calculateRoomModes(geometry),
        c50,
        c80,
        d50,
        stiEstimate,
        bassRatio,
        edt,
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
