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
