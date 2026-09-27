/** Notify the glossary as being viewed. */
export interface ModGlossaryViewGlossaryParams {
    /** Glossary instance ID */
    id: number | null;
    /** The mode in which the glossary is viewed */
    mode: string | null;
}

export interface ModGlossaryViewGlossaryReturns {
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

export type ModGlossaryViewGlossaryReturn = ModGlossaryViewGlossaryReturns;
export type mod_glossary_view_glossary_returns = ModGlossaryViewGlossaryReturns;
