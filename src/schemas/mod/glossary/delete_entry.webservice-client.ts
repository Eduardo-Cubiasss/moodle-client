/** Delete the given entry from the glossary. */
export interface ModGlossaryDeleteEntryParams {
    /** Glossary entry id to delete */
    entryid: number | null;
}

export interface ModGlossaryDeleteEntryReturns {
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

export type ModGlossaryDeleteEntryReturn = ModGlossaryDeleteEntryReturns;
export type mod_glossary_delete_entry_returns = ModGlossaryDeleteEntryReturns;
