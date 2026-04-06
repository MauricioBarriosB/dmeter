/**
 * Authentication Types
 */

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    lastLogin: string | null;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface ProfileUpdateData {
    name?: string;
    email?: string;
}

export interface PasswordUpdateData {
    currentPassword: string;
    newPassword: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthError {
    code: string;
    message: string;
    userMessage: string;
}

// User report interfaces

export interface UnifiedReport {
    id: string;
    name: string;
    type: "analysis" | "acoustics" | "materials" | "instruments" | "audio";
    typeLabel: string;
    date: string | null;
    createdAt: string | null;
    detailUrl: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
}

export interface AllReportsResponse {
    reports: UnifiedReport[];
    pagination: PaginationInfo;
}

export interface ReportStats {
    totalReports: number;
    counts: Record<string, number>;
    mostUsedType: string | null;
    mostUsedLabel: string | null;
    mostUsedCount: number;
    lastReportDate: string | null;
}

export interface AllReportsParams {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
