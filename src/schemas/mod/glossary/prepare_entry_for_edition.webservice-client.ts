/** Prepares the given entry for edition returning draft item areas and file areas information. */
export interface ModGlossaryPrepareEntryForEditionParams {
    /** Glossary entry id to update */
    entryid: number | null;
}

export interface ModGlossaryPrepareEntryForEditionReturns {
    /** Draft item id for the text editor. */
    inlineattachmentsid: number | null;
    /** Draft item id for the file manager. */
    attachmentsid: number | null;
    /** File areas including options */
    areas: Array<{
        /** File area name. */
        area: string | null;
        /** Draft file area options. */
        options: Array<{
            /** Name of option. */
            name: string | null;
            /** Value of option. */
            value: string | null;
        }>;
    }>;
    aliases: string | null[];
    categories: number | null[];
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

export type ModGlossaryPrepareEntryForEditionReturn = ModGlossaryPrepareEntryForEditionReturns;
export type mod_glossary_prepare_entry_for_edition_returns = ModGlossaryPrepareEntryForEditionReturns;
