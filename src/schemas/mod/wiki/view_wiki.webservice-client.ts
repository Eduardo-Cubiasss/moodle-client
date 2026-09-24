/** Trigger the course module viewed event and update the module completion status. */
export interface ModWikiViewWikiParams {
    /** Wiki instance ID. */
    wikiid: number | null;
}

export interface ModWikiViewWikiReturns {
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

export type ModWikiViewWikiReturn = ModWikiViewWikiReturns;
export type mod_wiki_view_wiki_returns = ModWikiViewWikiReturns;
