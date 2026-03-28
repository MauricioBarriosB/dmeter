import { useEffect, useCallback } from "react";
import { addToast } from "@heroui/react";
import { onApiError, API_ERROR_CODES, type ApiError } from "../services/apiConfig";

/**
 * Get toast color based on error code
 */
function getToastColor(code: string): "danger" | "warning" {
    switch (code) {
        case API_ERROR_CODES.NETWORK_ERROR:
            return "warning";
        case API_ERROR_CODES.AUTH_EXPIRED:
            return "warning";
        default:
            return "danger";
    }
}

/**
 * Get error title based on error code
 */
function getErrorTitle(code: string): string {
    switch (code) {
        case API_ERROR_CODES.AUTH_MISSING:
            return "Configuration Error";
        case API_ERROR_CODES.AUTH_EXPIRED:
            return "Session Expired";
        case API_ERROR_CODES.AUTH_INVALID:
            return "Authentication Failed";
        case API_ERROR_CODES.NOT_FOUND:
            return "Not Found";
        case API_ERROR_CODES.METHOD_NOT_ALLOWED:
            return "Invalid Request";
        case API_ERROR_CODES.SERVER_ERROR:
            return "Server Error";
        case API_ERROR_CODES.NETWORK_ERROR:
            return "Connection Error";
        default:
            return "Error";
    }
}

/**
 * Global API Error Notification component
 * Subscribes to API errors and displays toast notifications
 * Must be rendered inside HeroUIProvider with ToastProvider
 */
export default function ApiErrorNotification() {
    const handleApiError = useCallback((error: ApiError) => {
        addToast({
            title: getErrorTitle(error.code),
            description: error.userMessage,
            color: getToastColor(error.code),
            timeout: 6000,
        });
    }, []);

    useEffect(() => {
        const unsubscribe = onApiError(handleApiError);
        return unsubscribe;
    }, [handleApiError]);

    // This component doesn't render anything visible
    // It just subscribes to API errors and shows toasts
    return null;
}
