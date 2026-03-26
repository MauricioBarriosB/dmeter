/**
 * API Client for fetching data from DMeter API
 * Uses time-based HMAC authentication - the secret is never transmitted
 */

const API_URL = import.meta.env.VITE_APP_API_URL;
const API_SECRET = import.meta.env.VITE_APP_API_SECRET;

// Error codes from backend
export const API_ERROR_CODES = {
    AUTH_MISSING: "AUTH_MISSING",
    AUTH_EXPIRED: "AUTH_EXPIRED",
    AUTH_INVALID: "AUTH_INVALID",
    NOT_FOUND: "NOT_FOUND",
    METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
    SERVER_ERROR: "SERVER_ERROR",
    NETWORK_ERROR: "NETWORK_ERROR",
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

export interface ApiError {
    code: ApiErrorCode;
    message: string;
    userMessage: string;
    timestamp?: number;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: boolean;
    code?: string;
    message?: string;
    userMessage?: string;
}

// Cache for API responses
const dataCache: Map<string, { data: unknown; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Error listeners for global error handling
type ErrorListener = (error: ApiError) => void;
const errorListeners: Set<ErrorListener> = new Set();

/**
 * Subscribe to API errors
 */
export function onApiError(listener: ErrorListener): () => void {
    errorListeners.add(listener);
    return () => errorListeners.delete(listener);
}

/**
 * Notify all error listeners
 */
function notifyError(error: ApiError): void {
    errorListeners.forEach((listener) => {
        try {
            listener(error);
        } catch (e) {
            console.error("Error in API error listener:", e);
        }
    });
}

/**
 * Create an ApiError object
 */
function createApiError(code: ApiErrorCode, message: string, userMessage: string): ApiError {
    return { code, message, userMessage, timestamp: Date.now() };
}

/**
 * Generate HMAC-SHA256 signature using Web Crypto API
 */
async function generateSignature(timestamp: number): Promise<string> {
    const roundedTime = Math.floor(timestamp / 30) * 30;
    const message = roundedTime.toString();

    const encoder = new TextEncoder();
    const keyData = encoder.encode(API_SECRET);
    const messageData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);

    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);

    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    return signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Fetch data from the API with HMAC authentication
 */
export async function fetchFromApi<T>(endpoint: string): Promise<T> {
    // Check cache first
    const cached = dataCache.get(endpoint);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data as T;
    }

    // Check if API is configured
    if (!API_URL || !API_SECRET) {
        const error = createApiError(
            API_ERROR_CODES.AUTH_MISSING,
            "API not configured",
            "The application is not properly configured. Please contact support."
        );
        notifyError(error);
        throw error;
    }

    try {
        // Generate time-based signature
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = await generateSignature(timestamp);

        const url = `${API_URL}/${endpoint}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-API-Timestamp": timestamp.toString(),
                "X-API-Signature": signature,
            },
        });

        // Try to parse response as JSON
        let result: ApiResponse<T>;
        try {
            result = await response.json();
        } catch {
            // Response is not JSON
            const error = createApiError(
                API_ERROR_CODES.SERVER_ERROR,
                `Invalid response from server (${response.status})`,
                "The server returned an invalid response. Please try again later."
            );
            notifyError(error);
            throw error;
        }

        // Handle error responses
        if (!response.ok || result.error) {
            const errorCode = (result.code as ApiErrorCode) || API_ERROR_CODES.UNKNOWN_ERROR;
            const error = createApiError(
                errorCode,
                result.message || `API error: ${response.status}`,
                result.userMessage || "An error occurred while loading data. Please try again."
            );
            notifyError(error);
            throw error;
        }

        if (!result.success) {
            const error = createApiError(
                API_ERROR_CODES.UNKNOWN_ERROR,
                result.message || "API request failed",
                result.userMessage || "Failed to load data. Please try again."
            );
            notifyError(error);
            throw error;
        }

        // Cache the response
        dataCache.set(endpoint, { data: result.data, timestamp: Date.now() });

        return result.data;
    } catch (err) {
        // Handle network errors
        if (err instanceof TypeError && err.message.includes("fetch")) {
            const error = createApiError(
                API_ERROR_CODES.NETWORK_ERROR,
                "Network error: Unable to connect to API",
                "Unable to connect to the server. Please check your internet connection and try again."
            );
            notifyError(error);
            throw error;
        }

        // Re-throw ApiError objects
        if (err && typeof err === "object" && "code" in err && "userMessage" in err) {
            throw err;
        }

        // Handle unknown errors
        const error = createApiError(
            API_ERROR_CODES.UNKNOWN_ERROR,
            err instanceof Error ? err.message : "Unknown error",
            "An unexpected error occurred. Please try again later."
        );
        notifyError(error);
        throw error;
    }
}

/**
 * Clear the data cache
 */
export function clearApiCache(): void {
    dataCache.clear();
}

/**
 * Clear specific endpoint from cache
 */
export function clearCacheFor(endpoint: string): void {
    dataCache.delete(endpoint);
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
    if (error && typeof error === "object" && "userMessage" in error) {
        return (error as ApiError).userMessage;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "An unexpected error occurred. Please try again.";
}
