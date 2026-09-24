/** Trigger the forum discussion viewed event. */
export interface ModForumViewForumDiscussionParams {
    /** discussion id */
    discussionid: number | null;
}

export interface ModForumViewForumDiscussionReturns {
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

export type ModForumViewForumDiscussionReturn = ModForumViewForumDiscussionReturns;
export type mod_forum_view_forum_discussion_returns = ModForumViewForumDiscussionReturns;
