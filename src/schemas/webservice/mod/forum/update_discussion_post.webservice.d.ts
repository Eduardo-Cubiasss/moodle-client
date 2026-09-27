/** Updates a post or a discussion topic post. */
export interface ModForumUpdateDiscussionPostParams {
    /** Post to be updated. It can be a discussion topic post. */
    postid: number | null;
    /** Updated post subject */
    subject?: string | null;
    /** Updated post message (HTML assumed if messageformat is not provided) */
    message?: string | null;
    /** message format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
    messageformat?: number | null;
    /** Configuration options for the post. */
    options?: Array<{
        /** The allowed keys (value format) are: pinned (bool); (only for discussions) whether to pin this discussion or not discussionsubscribe (bool); whether to subscribe to the post or not inlineattachmentsid (int); the draft file area id for inline attachments in the text attachmentsid (int); the draft file area id for attachments */
        name: string | null;
        /** The value of the option. */
        value: string | null;
    }>;
}

export interface ModForumUpdateDiscussionPostReturns {
    /** True if the post/discussion was updated, false otherwise. */
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

export type ModForumUpdateDiscussionPostReturn = ModForumUpdateDiscussionPostReturns;
export type mod_forum_update_discussion_post_returns = ModForumUpdateDiscussionPostReturns;
