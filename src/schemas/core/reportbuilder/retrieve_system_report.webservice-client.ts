/** Retrieve system report content */
export interface CoreReportbuilderRetrieveSystemReportParams {
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
    /** Page number */
    page?: number | null;
    /** Reports per page */
    perpage?: number | null;
}

export interface CoreReportbuilderRetrieveSystemReportReturns {
    data: {
        /** headers */
        headers: string[];
        /** rows */
        rows: Array<{
            /** columns */
            columns: string | null[];
        }>;
        /** totalrowcount */
        totalrowcount: number;
    };
    /** list of warnings */
    warnings?: Array<{
        /** item */
        item?: string | null;
        /** item id */
        itemid?: number | null;
        /** the warning code can be used by the client app to implement specific behaviour */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type CoreReportbuilderRetrieveSystemReportReturn = CoreReportbuilderRetrieveSystemReportReturns;
export type core_reportbuilder_retrieve_system_report_returns = CoreReportbuilderRetrieveSystemReportReturns;
