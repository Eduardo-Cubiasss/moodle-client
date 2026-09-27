/** Deletes an existing data purpose */
export interface ToolDataprivacyDeletePurposeParams {
    /** The purpose ID */
    id: number | null;
}

export interface ToolDataprivacyDeletePurposeReturns {
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

export type ToolDataprivacyDeletePurposeReturn = ToolDataprivacyDeletePurposeReturns;
export type tool_dataprivacy_delete_purpose_returns = ToolDataprivacyDeletePurposeReturns;
