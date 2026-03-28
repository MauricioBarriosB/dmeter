// License validation using hash comparison
// The actual license key is never stored in plain text
// SHA-256 hash of the valid encoded license key

// Uses SHA-256 hash comparison (the actual license key is never in the code)
// validateLicense() - async function that validates the env variable against the stored hash

import { addToast } from "@heroui/react";

async function computeHash(value: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function validateLicense(): Promise<boolean> {
    try {
        const envValue = import.meta.env.VITE_GET_INSTANCE;

        if (!envValue || typeof envValue !== "string") {
            return false;
        }

        // Compute hash of the provided license
        const hash = await computeHash(envValue);

        // Compare with valid hash
        return hash === import.meta.env.VITE_VALID_LICENSE_HASH;
    } catch {
        return false;
    }
}

// Generate hash for a new license (for development use only)
export async function generateLicenseHash(encodedLicense: string): Promise<string> {
    return computeHash(encodedLicense);
}

// Show unauthorized toast notification
export function showUnauthorizedToast(): void {
    addToast({
        title: "Unauthorized Application",
        description: "This application deployment is not authorized.",
        color: "warning",
        timeout: 8000,
    });
}
