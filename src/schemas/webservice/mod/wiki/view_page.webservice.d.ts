/** Trigger the page viewed event and update the module completion status. */
export interface ModWikiViewPageParams {
    /** Wiki page ID. */
    pageid: number | null;
}

export interface ModWikiViewPageReturns {
    /** Status: true if success. */
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

export type ModWikiViewPageReturn = ModWikiViewPageReturns;
export type mod_wiki_view_page_returns = ModWikiViewPageReturns;
