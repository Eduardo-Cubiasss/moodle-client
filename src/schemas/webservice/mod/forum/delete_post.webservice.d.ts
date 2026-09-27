/** Deletes a post or a discussion completely when the post is the discussion topic. */
export interface ModForumDeletePostParams {
    /** Post to be deleted. It can be a discussion topic post. */
    postid: number | null;
}

export interface ModForumDeletePostReturns {
    /** True if the post/discussion was deleted, false otherwise. */
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

export type ModForumDeletePostReturn = ModForumDeletePostReturns;
export type mod_forum_delete_post_returns = ModForumDeletePostReturns;
