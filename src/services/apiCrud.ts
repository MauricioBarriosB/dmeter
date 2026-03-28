/**
 * API CRUD Service for DMeter Reports
 * Handles all CRUD operations for reports stored in the database
 * Uses axios via shared apiClient instance
 */

import { apiClient } from "@services/apiConfig";
import { tokenStorage } from "@services/apiAuth";
import type { AnalysisRecord } from "@modules/meter/types";
import type { AcousticsRecord } from "@modules/acoustics/types";
import type { MaterialsReportRecord } from "@modules/materials/types";
import type { InstrumentsReportRecord } from "@modules/instruments/types";
import type { AllReportsParams, AllReportsResponse } from "@modules/user/types";

/**
 * Get current user ID from token storage
 * Falls back to 0 if not authenticated (should not happen in protected routes)
 */
function getCurrentUserId(): number {
    const user = tokenStorage.getUser();
    return user?.id ?? 0;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: boolean;
    code?: string;
    userMessage?: string;
}

/**
 * Make authenticated API request using axios
 */
async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: unknown,
): Promise<T> {
    // Add userId to URL
    const userId = getCurrentUserId();
    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `/${endpoint}${separator}userId=${userId}`;

    const response = await apiClient.request<ApiResponse<T>>({
        url,
        method,
        data: body,
    });
    const result = response.data;
    if (!result.success) {
        throw new Error(result.userMessage || result.message || "API request failed");
    }
    return result.data;
}

// ============================================================================
// ANALYSIS REPORTS (METER)
// ============================================================================

export async function fetchAnalysisReports(): Promise<AnalysisRecord[]> {
    return apiRequest<AnalysisRecord[]>("analysis-reports");
}

export async function fetchAnalysisReport(id: string): Promise<AnalysisRecord> {
    return apiRequest<AnalysisRecord>(`analysis-reports/${id}`);
}

export async function createAnalysisReport(report: AnalysisRecord): Promise<AnalysisRecord> {
    return apiRequest<AnalysisRecord>("analysis-reports", "POST", report);
}

export async function updateAnalysisReport(id: string, report: AnalysisRecord): Promise<AnalysisRecord> {
    return apiRequest<AnalysisRecord>(`analysis-reports/${id}`, "PUT", report);
}

export async function deleteAnalysisReport(id: string): Promise<void> {
    await apiRequest<null>(`analysis-reports/${id}`, "DELETE");
}

export async function clearAnalysisReports(): Promise<void> {
    await apiRequest<null>("analysis-reports", "DELETE");
}

// ============================================================================
// ACOUSTICS REPORTS
// ============================================================================

export async function fetchAcousticsReports(): Promise<AcousticsRecord[]> {
    return apiRequest<AcousticsRecord[]>("acoustics-reports");
}

export async function fetchAcousticsReport(id: string): Promise<AcousticsRecord> {
    return apiRequest<AcousticsRecord>(`acoustics-reports/${id}`);
}

export async function createAcousticsReport(report: AcousticsRecord): Promise<AcousticsRecord> {
    return apiRequest<AcousticsRecord>("acoustics-reports", "POST", report);
}

export async function updateAcousticsReport(id: string, report: AcousticsRecord): Promise<AcousticsRecord> {
    return apiRequest<AcousticsRecord>(`acoustics-reports/${id}`, "PUT", report);
}

export async function deleteAcousticsReport(id: string): Promise<void> {
    await apiRequest<null>(`acoustics-reports/${id}`, "DELETE");
}

export async function clearAcousticsReports(): Promise<void> {
    await apiRequest<null>("acoustics-reports", "DELETE");
}

// ============================================================================
// MATERIALS REPORTS
// ============================================================================

export async function fetchMaterialsReports(): Promise<MaterialsReportRecord[]> {
    return apiRequest<MaterialsReportRecord[]>("materials-reports");
}

export async function fetchMaterialsReport(id: string): Promise<MaterialsReportRecord> {
    return apiRequest<MaterialsReportRecord>(`materials-reports/${id}`);
}

export async function createMaterialsReport(report: MaterialsReportRecord): Promise<MaterialsReportRecord> {
    return apiRequest<MaterialsReportRecord>("materials-reports", "POST", report);
}

export async function updateMaterialsReport(id: string, report: MaterialsReportRecord): Promise<MaterialsReportRecord> {
    return apiRequest<MaterialsReportRecord>(`materials-reports/${id}`, "PUT", report);
}

export async function deleteMaterialsReport(id: string): Promise<void> {
    await apiRequest<null>(`materials-reports/${id}`, "DELETE");
}

export async function clearMaterialsReports(): Promise<void> {
    await apiRequest<null>("materials-reports", "DELETE");
}

// ============================================================================
// INSTRUMENTS REPORTS
// ============================================================================

export async function fetchInstrumentsReports(): Promise<InstrumentsReportRecord[]> {
    return apiRequest<InstrumentsReportRecord[]>("instruments-reports");
}

export async function fetchInstrumentsReport(id: string): Promise<InstrumentsReportRecord> {
    return apiRequest<InstrumentsReportRecord>(`instruments-reports/${id}`);
}

export async function createInstrumentsReport(report: InstrumentsReportRecord): Promise<InstrumentsReportRecord> {
    return apiRequest<InstrumentsReportRecord>("instruments-reports", "POST", report);
}

export async function updateInstrumentsReport(
    id: string,
    report: InstrumentsReportRecord,
): Promise<InstrumentsReportRecord> {
    return apiRequest<InstrumentsReportRecord>(`instruments-reports/${id}`, "PUT", report);
}

export async function deleteInstrumentsReport(id: string): Promise<void> {
    await apiRequest<null>(`instruments-reports/${id}`, "DELETE");
}

export async function clearInstrumentsReports(): Promise<void> {
    await apiRequest<null>("instruments-reports", "DELETE");
}

// ============================================================================
// AUDIO REPORTS
// ============================================================================

// Note: AudioRecord type is defined in audioStorage.ts due to its complex nested structure
// These functions use generics and the caller provides the proper type

export async function fetchAudioReports<T>(): Promise<T[]> {
    return apiRequest<T[]>("audio-reports");
}

export async function fetchAudioReport<T>(id: string): Promise<T> {
    return apiRequest<T>(`audio-reports/${id}`);
}

export async function createAudioReport<T>(report: T): Promise<T> {
    return apiRequest<T>("audio-reports", "POST", report);
}

export async function updateAudioReport<T>(id: string, report: T): Promise<T> {
    return apiRequest<T>(`audio-reports/${id}`, "PUT", report);
}

export async function deleteAudioReport(id: string): Promise<void> {
    await apiRequest<null>(`audio-reports/${id}`, "DELETE");
}

export async function clearAudioReports(): Promise<void> {
    await apiRequest<null>("audio-reports", "DELETE");
}

// ============================================================================
// ALL REPORTS (COMBINED WITH PAGINATION)
// ============================================================================

export async function fetchAllReports(params: AllReportsParams = {}): Promise<AllReportsResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set("page", params.page.toString());
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.type) queryParams.set("type", params.type);
    if (params.search) queryParams.set("search", params.search);
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `all-reports?${queryString}` : "all-reports";

    return apiRequest<AllReportsResponse>(endpoint);
}

export async function deleteReportByType(type: string, id: string): Promise<void> {
    const endpoints: Record<string, string> = {
        analysis: "analysis-reports",
        acoustics: "acoustics-reports",
        materials: "materials-reports",
        instruments: "instruments-reports",
        audio: "audio-reports",
    };

    const endpoint = endpoints[type];
    if (!endpoint) {
        throw new Error(`Unknown report type: ${type}`);
    }

    await apiRequest<null>(`${endpoint}/${id}`, "DELETE");
}
