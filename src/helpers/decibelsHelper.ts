/**
 * Calculate decibels from audio time domain data
 * Uses RMS (Root Mean Square) for accurate dB reading
 */
export function calculateDecibels(dataArray: Uint8Array): number {
    let sum = 0;
    for (const value of dataArray) {
        const normalized = (value - 128) / 128;
        sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / dataArray.length);

    // Convert to decibels (dB)
    // Using 20 * log10(rms) with a floor to avoid -Infinity
    const db = rms > 0 ? 20 * Math.log10(rms) : -100;
    return Math.max(-100, Math.min(0, db));
}
