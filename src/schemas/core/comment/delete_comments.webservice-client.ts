/** Deletes a comment or comments. */
export interface CoreCommentDeleteCommentsParams {
    comments: number | null[];
}

/** list of warnings */
export type CoreCommentDeleteCommentsReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type CoreCommentDeleteCommentsReturn = CoreCommentDeleteCommentsReturns;
export type core_comment_delete_comments_returns = CoreCommentDeleteCommentsReturns;
