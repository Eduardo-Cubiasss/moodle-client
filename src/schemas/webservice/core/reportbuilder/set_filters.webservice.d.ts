/** Set filter values for given report */
export interface CoreReportbuilderSetFiltersParams {
    /** Report ID */
    reportid: number | null;
    /** JSON encoded report parameters */
    parameters?: string | null;
    /** JSON encoded filter values */
    values: string | null;
}

/** Success */
export type CoreReportbuilderSetFiltersReturns = boolean | null;

export type CoreReportbuilderSetFiltersReturn = CoreReportbuilderSetFiltersReturns;
export type core_reportbuilder_set_filters_returns = CoreReportbuilderSetFiltersReturns;
