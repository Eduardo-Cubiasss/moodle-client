/** Log that the h5pactivity was viewed. */
export interface ModH5pactivityLogReportViewedParams {
    /** h5p activity instance id */
    h5pactivityid: number | null;
    /** The user id to log attempt (null means only current user) */
    userid?: number | null;
    /** The attempt id */
    attemptid?: number | null;
}

export interface ModH5pactivityLogReportViewedReturns {
    /** status: true if success */
    status: boolean | null;
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

export type ModH5pactivityLogReportViewedReturn = ModH5pactivityLogReportViewedReturns;
export type mod_h5pactivity_log_report_viewed_returns = ModH5pactivityLogReportViewedReturns;
