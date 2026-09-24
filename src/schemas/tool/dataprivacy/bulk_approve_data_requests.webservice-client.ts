/** Bulk approve data requests */
export interface ToolDataprivacyBulkApproveDataRequestsParams {
    requestids: number | null[];
}

export interface ToolDataprivacyBulkApproveDataRequestsReturns {
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

export type ToolDataprivacyBulkApproveDataRequestsReturn = ToolDataprivacyBulkApproveDataRequestsReturns;
export type tool_dataprivacy_bulk_approve_data_requests_returns = ToolDataprivacyBulkApproveDataRequestsReturns;
