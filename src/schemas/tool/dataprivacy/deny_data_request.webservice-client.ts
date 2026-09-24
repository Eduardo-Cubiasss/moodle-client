/** Deny a data request */
export interface ToolDataprivacyDenyDataRequestParams {
    /** The request ID */
    requestid: number | null;
}

export interface ToolDataprivacyDenyDataRequestReturns {
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

export type ToolDataprivacyDenyDataRequestReturn = ToolDataprivacyDenyDataRequestReturns;
export type tool_dataprivacy_deny_data_request_returns = ToolDataprivacyDenyDataRequestReturns;
