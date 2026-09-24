/** Save the contents of a page. */
export interface ModWikiEditPageParams {
    /** Page ID. */
    pageid: number | null;
    /** Page contents. */
    content: string | null;
    /** Section page title. */
    section?: string | null;
}

export interface ModWikiEditPageReturns {
    /** Edited page id. */
    pageid: number | null;
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

export type ModWikiEditPageReturn = ModWikiEditPageReturns;
export type mod_wiki_edit_page_returns = ModWikiEditPageReturns;
