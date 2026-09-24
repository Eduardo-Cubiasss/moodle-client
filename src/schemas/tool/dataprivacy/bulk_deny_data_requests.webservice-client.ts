/** Bulk deny data requests */
export interface ToolDataprivacyBulkDenyDataRequestsParams {
    requestids: number | null[];
}

export interface ToolDataprivacyBulkDenyDataRequestsReturns {
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

export type ToolDataprivacyBulkDenyDataRequestsReturn = ToolDataprivacyBulkDenyDataRequestsReturns;
export type tool_dataprivacy_bulk_deny_data_requests_returns = ToolDataprivacyBulkDenyDataRequestsReturns;
