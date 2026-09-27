/** Trigger the attempt reviewed event. */
export interface ModQuizViewAttemptReviewParams {
    /** attempt id */
    attemptid: number | null;
}

export interface ModQuizViewAttemptReviewReturns {
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

export type ModQuizViewAttemptReviewReturn = ModQuizViewAttemptReviewReturns;
export type mod_quiz_view_attempt_review_returns = ModQuizViewAttemptReviewReturns;
