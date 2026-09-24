/** Locks and retrieves info of page-section to be edited. */
export interface ModWikiGetPageForEditingParams {
    /** Page ID to edit. */
    pageid: number | null;
    /** Section page title. */
    section?: string | null;
    /** Just renew lock and not return content. */
    lockonly?: boolean | null;
}

export interface ModWikiGetPageForEditingReturns {
    pagesection: {
        /** The contents of the page-section to be edited. */
        content?: string | null;
        /** Format of the original content of the page. */
        contentformat?: string | null;
        /** Latest version of the page. */
        version: number | null;
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
    };
}

export type ModWikiGetPageForEditingReturn = ModWikiGetPageForEditingReturns;
export type mod_wiki_get_page_for_editing_returns = ModWikiGetPageForEditingReturns;
