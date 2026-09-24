/** Notify a glossary entry as being viewed. */
export interface ModGlossaryViewEntryParams {
    /** Glossary entry ID */
    id: number | null;
}

export interface ModGlossaryViewEntryReturns {
    /** True on success */
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

export type ModGlossaryViewEntryReturn = ModGlossaryViewEntryReturns;
export type mod_glossary_view_entry_returns = ModGlossaryViewEntryReturns;
