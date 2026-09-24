/** Returns the list of subwikis the user can see in a specific wiki. */
export interface ModWikiGetSubwikisParams {
    /** Wiki instance ID. */
    wikiid: number | null;
}

export interface ModWikiGetSubwikisReturns {
    subwikis: Array<{
        /** Subwiki ID. */
        id: number | null;
        /** Wiki ID. */
        wikiid: number | null;
        /** Group ID. */
        groupid: string | null;
        /** User ID. */
        userid: number | null;
        /** True if user can edit the subwiki. */
        canedit: boolean | null;
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

export type ModWikiGetSubwikisReturn = ModWikiGetSubwikisReturns;
export type mod_wiki_get_subwikis_returns = ModWikiGetSubwikisReturns;
