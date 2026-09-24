/** Check if the current user can add discussions in the given forum (and optionally for the given group). */
export interface ModForumCanAddDiscussionParams {
    /** Forum instance ID */
    forumid: number | null;
    /** The group to check, default to active group. Use -1 to check if the user can post in all the groups. */
    groupid?: number | null;
}

export interface ModForumCanAddDiscussionReturns {
    /** True if the user can add discussions, false otherwise. */
    status: boolean | null;
    /** True if the user can pin discussions, false otherwise. */
    canpindiscussions?: boolean | null;
    /** True if the user can add attachments, false otherwise. */
    cancreateattachment?: boolean | null;
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

export type ModForumCanAddDiscussionReturn = ModForumCanAddDiscussionReturns;
export type mod_forum_can_add_discussion_returns = ModForumCanAddDiscussionReturns;
