/** Deletes an entry. */
export interface ModDataDeleteEntryParams {
    /** Record entry id. */
    entryid: number | null;
}

export interface ModDataDeleteEntryReturns {
    /** Always true. If we see this field it means that the entry was deleted. */
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

export type ModDataDeleteEntryReturn = ModDataDeleteEntryReturns;
export type mod_data_delete_entry_returns = ModDataDeleteEntryReturns;
