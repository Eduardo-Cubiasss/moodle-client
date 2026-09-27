/** Re-order column within report */
export interface CoreReportbuilderColumnsReorderParams {
    /** Report ID */
    reportid: number | null;
    /** Column ID */
    columnid: number | null;
    /** New column position */
    position: number | null;
}

/** Success */
export type CoreReportbuilderColumnsReorderReturns = boolean | null;

export type CoreReportbuilderColumnsReorderReturn = CoreReportbuilderColumnsReorderReturns;
export type core_reportbuilder_columns_reorder_returns = CoreReportbuilderColumnsReorderReturns;
