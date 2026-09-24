/** Trigger the blog_entries_viewed event. */
export interface CoreBlogViewEntriesParams {
    /** Parameters used in the filter of view_entries. */
    filters?: Array<{
        /** The expected keys (value format) are: tag PARAM_NOTAGS blog tag tagid PARAM_INT blog tag id userid PARAM_INT blog author (userid) cmid PARAM_INT course module id entryid PARAM_INT entry id groupid PARAM_INT group id courseid PARAM_INT course id search PARAM_RAW search term */
        name: string | null;
        /** The value of the filter. */
        value: string | null;
    }>;
}

export interface CoreBlogViewEntriesReturns {
    /** status: true if success */
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

export type CoreBlogViewEntriesReturn = CoreBlogViewEntriesReturns;
export type core_blog_view_entries_returns = CoreBlogViewEntriesReturns;
