/** Creates a data request. */
export interface ToolDataprivacyCreateDataRequestParams {
    /** The type of data request to create. 1 for export, 2 for data deletion. */
    type: number | null;
    /** Comments for the data request. */
    comments?: string | null;
    /** The id of the user to create the data request for. Empty for current user. */
    foruserid?: number | null;
}

export interface ToolDataprivacyCreateDataRequestReturns {
    /** The id of the created data request. */
    datarequestid: number | null;
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

export type ToolDataprivacyCreateDataRequestReturn = ToolDataprivacyCreateDataRequestReturns;
export type tool_dataprivacy_create_data_request_returns = ToolDataprivacyCreateDataRequestReturns;
