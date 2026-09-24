/** Retrieves existing tag collections. */
export interface CoreTagGetTagCollectionsParams {}

export interface CoreTagGetTagCollectionsReturns {
    collections: Array<{
        /** Collection id. */
        id: number;
        /** Collection name. */
        name: string | null;
        /** Whether is the default collection. */
        isdefault: boolean;
        /** Component the collection is related to. */
        component: string | null;
        /** Collection ordering in the list. */
        sortorder: number;
        /** Whether the tag collection is searchable. */
        searchable: boolean;
        /** Custom URL for the tag page instead of /tag/index.php. */
        customurl: string | null;
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

export type CoreTagGetTagCollectionsReturn = CoreTagGetTagCollectionsReturns;
export type core_tag_get_tag_collections_returns = CoreTagGetTagCollectionsReturns;
