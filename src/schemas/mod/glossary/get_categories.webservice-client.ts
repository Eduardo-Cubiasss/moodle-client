/** Get the categories. */
export interface ModGlossaryGetCategoriesParams {
    /** The glossary ID */
    id: number | null;
    /** Start returning records from here */
    from?: number | null;
    /** Number of records to return */
    limit?: number | null;
}

export interface ModGlossaryGetCategoriesReturns {
    /** The total number of records. */
    count: number | null;
    categories: Array<{
        /** The category ID */
        id: number | null;
        /** The glossary ID */
        glossaryid: number | null;
        /** The name of the category */
        name: string | null;
        /** Whether the category is automatically linked */
        usedynalink: boolean | null;
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

export type ModGlossaryGetCategoriesReturn = ModGlossaryGetCategoriesReturns;
export type mod_glossary_get_categories_returns = ModGlossaryGetCategoriesReturns;
