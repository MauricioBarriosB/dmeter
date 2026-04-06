// Instruments Report Record
export interface InstrumentsReportRecord {
    id: string;
    reportName: string;
    ensembleType: string;
    ensembleTypeLabel: string;
    genre: string;
    genreLabel: string;
    selectedInstruments: string[];
    selectedInstrumentsLabels: string[];
    createdAt: string;
}

export type InstrumentCategoryType =
    | "Rock & Metal"
    | "Strings"
    | "Woodwinds"
    | "Brass"
    | "Percussion"
    | "Keyboards"
    | "Electronic"
    | "Ethnic"
    | "Vocals";

export interface InstrumentProperties {
    category: InstrumentCategoryType;
    frequencyLow: number;
    frequencyHigh: number;
    fundamentalRange: string;
    harmonicsRange: string;
}
