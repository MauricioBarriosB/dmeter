// Acoustics Form
export interface AcousticsFormData {
    analysisName: string;
    roomHeight: string;
    roomWidth: string;
    roomDepth: string;
    roomPurpose: string;
    roofType: string;
    floorMaterial: string;
    ceilingMaterial: string;
    wallMaterial: string;
    temperature: string;
    humidity: string;
    occupancy: string;
    windowArea: string;
    doorCount: string;
}

// Acoustics Analysis Record
export interface AcousticsRecord {
    id: string;
    analysisName: string;
    roomHeight: string;
    roomWidth: string;
    roomDepth: string;
    roomPurpose: string;
    roofType: string;
    floorMaterial: string;
    ceilingMaterial: string;
    wallMaterial: string;
    temperature: string;
    humidity: string;
    occupancy: string;
    windowArea: string;
    doorCount: string;
    date: string;
}

// Frequency absorption coefficients by band
export interface FrequencyAbsorption {
    "125": number;
    "250": number;
    "500": number;
    "1000": number;
    "2000": number;
    "4000": number;
}

// Optimal RT60 range for room purposes
export interface OptimalRT60 {
    min: number;
    max: number;
    ideal: number;
}

// Room purpose configuration
export interface RoomPurposeOption {
    key: string;
    label: string;
    optimalRT60: OptimalRT60;
}

// Roof type configuration
export interface RoofTypeOption {
    key: string;
    label: string;
    volumeMultiplier: number;
}

// Material absorption option
export interface MaterialOption {
    key: string;
    label: string;
    absorption: FrequencyAbsorption;
}

// Complete acoustics configuration from API
export interface AcousticsConfig {
    frequencyBands: number[];
    roomPurposeOptions: RoomPurposeOption[];
    roofTypeOptions: RoofTypeOption[];
    materialOptions: MaterialOption[];
    personAbsorption: FrequencyAbsorption;
    airAbsorption: FrequencyAbsorption;
    doorAbsorption: number;
}

// Rom geometry
export interface RoomGeometry {
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

// Frequency bands for analysis (Hz)
export const FREQ_BANDS = [125, 250, 500, 1000, 2000, 4000] as const;
export type FrequencyBand = (typeof FREQ_BANDS)[number];

// Type aliases
export type RT60Status = "optimal" | "too_dry" | "too_reverberant";
export type ChipColor = "success" | "warning" | "danger";

// Frequency metrics per band
export interface FrequencyMetrics {
    rt60Sabine: number;
    rt60Eyring: number;
    totalAbsorption: number;
}

// Complete acoustic metrics calculation result
export interface AcousticMetrics {
    volume: number;
    surfaceArea: number;
    floorArea: number;
    wallArea: number;
    ceilingArea: number;
    speedOfSound: number;
    frequencyMetrics: Record<number, FrequencyMetrics>;
    rt60Mid: number;
    optimalRT60Range: OptimalRT60;
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
