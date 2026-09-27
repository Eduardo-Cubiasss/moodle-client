/** Get the authors. */
export interface ModGlossaryGetAuthorsParams {
    /** Glossary entry ID */
    id: number | null;
    /** Start returning records from here */
    from?: number | null;
    /** Number of records to return */
    limit?: number | null;
    /** An array of options */
    options?: {
        /** When false, includes self even if all of their entries require approval. When true, also includes authors only having entries pending approval. */
        includenotapproved?: boolean | null;
    };
}

export interface ModGlossaryGetAuthorsReturns {
    /** The total number of records. */
    count: number | null;
    authors: Array<{
        /** The user ID */
        id: number | null;
        /** The fullname */
        fullname: string | null;
        /** The picture URL */
        pictureurl: string | null;
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

export type ModGlossaryGetAuthorsReturn = ModGlossaryGetAuthorsReturns;
export type mod_glossary_get_authors_returns = ModGlossaryGetAuthorsReturns;
