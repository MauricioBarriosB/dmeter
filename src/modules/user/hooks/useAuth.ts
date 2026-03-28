/**
 * Authentication Hook
 *
 * Provides authentication state and actions for components.
 */

import { useState, useEffect, useCallback } from "react";
import type { User, LoginCredentials, RegisterData, ProfileUpdateData, PasswordUpdateData } from "../types";
import {
    login as apiLogin,
    register as apiRegister,
    logout as apiLogout,
    getCurrentUser,
    updateProfile as apiUpdateProfile,
    updatePassword as apiUpdatePassword,
    refreshAccessToken,
    tokenStorage,
    getAuthErrorMessage,
} from "@services/apiAuth";

interface UseAuthReturn {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => Promise<void>;
    updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
    updatePassword: (data: PasswordUpdateData) => Promise<boolean>;
    refreshUser: () => Promise<void>;
    clearError: () => void;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(tokenStorage.getUser());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!user && tokenStorage.isAuthenticated();

    // Initialize auth state on mount
    useEffect(() => {
        const initAuth = async () => {
            if (tokenStorage.isAuthenticated()) {
                try {
                    const currentUser = await getCurrentUser();
                    setUser(currentUser);
                } catch {
                    // Token might be expired, try to refresh
                    const refreshed = await refreshAccessToken();
                    if (refreshed) {
                        setUser(refreshed.user);
                    } else {
                        setUser(null);
                    }
                }
            }
        };

        initAuth();
    }, []);

    const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiLogin(credentials);
            setUser(response.user);
            return true;
        } catch (err) {
            const errorCode = (err as { code?: string })?.code || "UNKNOWN_ERROR";
            setError(getAuthErrorMessage(errorCode));
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (data: RegisterData): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiRegister(data);
            setUser(response.user);
            return true;
        } catch (err) {
            const errorCode = (err as { code?: string })?.code || "UNKNOWN_ERROR";
            setError(getAuthErrorMessage(errorCode));
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        setIsLoading(true);

        try {
            await apiLogout();
        } finally {
            setUser(null);
            setError(null);
            setIsLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (data: ProfileUpdateData): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const updatedUser = await apiUpdateProfile(data);
            setUser(updatedUser);
            return true;
        } catch (err) {
            const errorCode = (err as { code?: string })?.code || "UNKNOWN_ERROR";
            setError(getAuthErrorMessage(errorCode));
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updatePassword = useCallback(async (data: PasswordUpdateData): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            await apiUpdatePassword(data);
            return true;
        } catch (err) {
            const errorCode = (err as { code?: string })?.code || "UNKNOWN_ERROR";
            setError(getAuthErrorMessage(errorCode));
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshUser = useCallback(async (): Promise<void> => {
        if (!tokenStorage.isAuthenticated()) return;

        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            // Silently fail
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        refreshUser,
        clearError,
    };
}
