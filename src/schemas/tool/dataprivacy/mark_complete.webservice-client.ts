/** Mark a user's general enquiry as complete */
export interface ToolDataprivacyMarkCompleteParams {
    /** The request ID */
    requestid: number | null;
}

export interface ToolDataprivacyMarkCompleteReturns {
    /** The processing result */
    result: boolean | null;
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

export type ToolDataprivacyMarkCompleteReturn = ToolDataprivacyMarkCompleteReturns;
export type tool_dataprivacy_mark_complete_returns = ToolDataprivacyMarkCompleteReturns;
