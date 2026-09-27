/** Returns comments. */
export interface CoreCommentGetCommentsParams {
    /** contextlevel system, course, user... */
    contextlevel: string | null;
    /** the Instance id of item associated with the context level */
    instanceid: number | null;
    /** component */
    component: string | null;
    /** associated id */
    itemid: number | null;
    /** string comment area */
    area?: string | null;
    /** page number (0 based) */
    page?: number | null;
    /** Sort direction: ASC or DESC */
    sortdirection?: string | null;
}

export interface CoreCommentGetCommentsReturns {
    /** List of comments */
    comments: Array<{
        /** Comment ID */
        id: number | null;
        /** The content text formatted */
        content: string | null;
        /** content format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        format: number | null;
        /** Time created (timestamp) */
        timecreated: number | null;
        /** Time format */
        strftimeformat: string | null;
        /** URL profile */
        profileurl: string | null;
        /** fullname */
        fullname: string | null;
        /** Time in human format */
        time: string | null;
        /** HTML user picture */
        avatar: string | null;
        /** User ID */
        userid: number | null;
        /** Permission to delete=true/false */
        delete?: boolean | null;
    }>;
    /** Total number of comments. */
    count?: number | null;
    /** Number of comments per page. */
    perpage?: number | null;
    /** Whether the user can post in this comment area. */
    canpost?: boolean | null;
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

export type CoreCommentGetCommentsReturn = CoreCommentGetCommentsReturns;
export type core_comment_get_comments_returns = CoreCommentGetCommentsReturns;
