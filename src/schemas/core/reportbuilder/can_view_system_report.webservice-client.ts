/** Determine access to a system report */
export interface CoreReportbuilderCanViewSystemReportParams {
    /** Report class path */
    source: string | null;
    context: {
        /** Context ID. Either use this value, or level and instanceid. */
        contextid?: number | null;
        /** Context level. To be used with instanceid. */
        contextlevel?: string | null;
        /** Context instance ID. To be used with level */
        instanceid?: number | null;
    };
    /** Report component */
    component?: string | null;
    /** Report area */
    area?: string | null;
    /** Report item ID */
    itemid?: number | null;
    /** Report parameters */
    parameters?: Array<{
        name: string | null;
        value: string | null;
    }>;
}

export type CoreReportbuilderCanViewSystemReportReturns = boolean | null;

export type CoreReportbuilderCanViewSystemReportReturn = CoreReportbuilderCanViewSystemReportReturns;
export type core_reportbuilder_can_view_system_report_returns = CoreReportbuilderCanViewSystemReportReturns;
