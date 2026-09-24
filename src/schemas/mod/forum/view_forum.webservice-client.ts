/** Trigger the course module viewed event and update the module completion status. */
export interface ModForumViewForumParams {
    /** forum instance id */
    forumid: number | null;
}

export interface ModForumViewForumReturns {
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

export type ModForumViewForumReturn = ModForumViewForumReturns;
export type mod_forum_view_forum_returns = ModForumViewForumReturns;
