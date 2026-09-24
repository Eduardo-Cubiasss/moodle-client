/** Deletes a blog post entry. */
export interface CoreBlogDeleteEntryParams {
    /** The entry id to remove. */
    entryid: number | null;
}

export interface CoreBlogDeleteEntryReturns {
    /** True indicates the entry was deleted. */
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

export type CoreBlogDeleteEntryReturn = CoreBlogDeleteEntryReturns;
export type core_blog_delete_entry_returns = CoreBlogDeleteEntryReturns;
