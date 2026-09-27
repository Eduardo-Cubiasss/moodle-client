/** Combines the review options from a number of different quiz attempts. */
export interface ModQuizGetCombinedReviewOptionsParams {
    /** quiz instance id */
    quizid: number | null;
    /** user id (empty for current user) */
    userid?: number | null;
}

export interface ModQuizGetCombinedReviewOptionsReturns {
    someoptions: Array<{
        /** option name */
        name: string | null;
        /** option value */
        value: number | null;
    }>;
    alloptions: Array<{
        /** option name */
        name: string | null;
        /** option value */
        value: number | null;
    }>;
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

export type ModQuizGetCombinedReviewOptionsReturn = ModQuizGetCombinedReviewOptionsReturns;
export type mod_quiz_get_combined_review_options_returns = ModQuizGetCombinedReviewOptionsReturns;
