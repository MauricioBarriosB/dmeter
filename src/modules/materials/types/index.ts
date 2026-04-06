// Materials Report Record
export interface MaterialsReportRecord {
    id: string;
    reportName: string;
    buildType: string;
    buildTypeLabel: string;
    selectedMaterials: string[];
    selectedMaterialsLabels: string[];
    createdAt: string;
}
