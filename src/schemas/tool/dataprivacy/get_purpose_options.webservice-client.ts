/** Fetches a list of data storage purpose options */
export interface ToolDataprivacyGetPurposeOptionsParams {
    /** Include option "Inherit" */
    includeinherit?: boolean | null;
    /** Include option "Not set" */
    includenotset?: boolean | null;
}

export interface ToolDataprivacyGetPurposeOptionsReturns {
    options: Array<{
        /** The purpose ID */
        id: number | null;
        /** The purpose name */
        name: string | null;
    }>;
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

export type ToolDataprivacyGetPurposeOptionsReturn = ToolDataprivacyGetPurposeOptionsReturns;
export type tool_dataprivacy_get_purpose_options_returns = ToolDataprivacyGetPurposeOptionsReturns;
