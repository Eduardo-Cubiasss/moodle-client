/** Trigger custom report viewed */
export interface CoreReportbuilderViewReportParams {
    /** Report ID */
    reportid: number | null;
}

export interface CoreReportbuilderViewReportReturns {
    /** Success */
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

export type CoreReportbuilderViewReportReturn = CoreReportbuilderViewReportReturns;
export type core_reportbuilder_view_report_returns = CoreReportbuilderViewReportReturns;
