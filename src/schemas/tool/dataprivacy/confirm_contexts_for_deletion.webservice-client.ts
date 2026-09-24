/** Mark the selected expired contexts as confirmed for deletion */
export interface ToolDataprivacyConfirmContextsForDeletionParams {
    /** Array of expired context record IDs */
    ids?: number | null[];
}

export interface ToolDataprivacyConfirmContextsForDeletionReturns {
    /** Whether the record was properly marked for deletion or not */
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

export type ToolDataprivacyConfirmContextsForDeletionReturn = ToolDataprivacyConfirmContextsForDeletionReturns;
export type tool_dataprivacy_confirm_contexts_for_deletion_returns = ToolDataprivacyConfirmContextsForDeletionReturns;
