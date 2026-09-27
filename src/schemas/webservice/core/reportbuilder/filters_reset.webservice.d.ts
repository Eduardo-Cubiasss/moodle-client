/** Reset filters for given report */
export interface CoreReportbuilderFiltersResetParams {
    /** Report ID */
    reportid: number | null;
    /** JSON encoded report parameters */
    parameters?: string | null;
}

/** Success */
export type CoreReportbuilderFiltersResetReturns = boolean | null;

export type CoreReportbuilderFiltersResetReturn = CoreReportbuilderFiltersResetReturns;
export type core_reportbuilder_filters_reset_returns = CoreReportbuilderFiltersResetReturns;
