/**
 * API Client for fetching data from DMeter API
 * Uses axios with time-based HMAC authentication
 */

import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

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
 * Create axios instance with base configuration
 */
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000, // 30 seconds
});

/**
 * Request interceptor to add HMAC authentication headers
 */
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (!API_SECRET) {
            const error = createApiError(
                API_ERROR_CODES.AUTH_MISSING,
                "API not configured",
                "The application is not properly configured. Please contact support."
            );
            throw new Error(error.userMessage);
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const signature = await generateSignature(timestamp);

        config.headers.set("X-API-Timestamp", timestamp.toString());
        config.headers.set("X-API-Signature", signature);

        return config;
    },
    (error: Error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor to handle errors globally
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiResponse<unknown>>) => {
        let apiError: ApiError;

        if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK" || !error.response) {
            apiError = createApiError(
                API_ERROR_CODES.NETWORK_ERROR,
                "Network error: Unable to connect to API",
                "Unable to connect to the server. Please check your internet connection and try again."
            );
        } else {
            const responseData = error.response.data;
            const errorCode = (responseData?.code as ApiErrorCode) || API_ERROR_CODES.UNKNOWN_ERROR;
            apiError = createApiError(
                errorCode,
                responseData?.message || `API error: ${error.response.status}`,
                responseData?.userMessage || "An error occurred while loading data. Please try again."
            );
        }

        notifyError(apiError);
        return Promise.reject(apiError);
    }
);

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
        const response = await apiClient.get<ApiResponse<T>>(`/${endpoint}`);
        const result = response.data;

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
