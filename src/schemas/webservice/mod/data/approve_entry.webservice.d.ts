/** Approves or unapproves an entry. */
export interface ModDataApproveEntryParams {
    /** Record entry id. */
    entryid: number | null;
    /** Whether to approve (true) or unapprove the entry. */
    approve?: boolean | null;
}

export interface ModDataApproveEntryReturns {
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

export type ModDataApproveEntryReturn = ModDataApproveEntryReturns;
export type mod_data_approve_entry_returns = ModDataApproveEntryReturns;
