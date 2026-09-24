/** Retrieves responses from the current unfinished attempt. */
export interface ModFeedbackGetUnfinishedResponsesParams {
    /** Feedback instance id. */
    feedbackid: number | null;
    /** Course where user completes the feedback (for site feedbacks only). */
    courseid?: number | null;
}

export interface ModFeedbackGetUnfinishedResponsesReturns {
    responses: Array<{
        /** The record id. */
        id: number;
        /** The course id this record belongs to. */
        course_id: number;
        /** The item id that was responded. */
        item: number;
        /** Reference to the feedback_completedtmp table. */
        completed: number;
        /** Old field - not used anymore. */
        tmp_completed: number;
        /** The response value. */
        value: string;
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

export type ModFeedbackGetUnfinishedResponsesReturn = ModFeedbackGetUnfinishedResponsesReturns;
export type mod_feedback_get_unfinished_responses_returns = ModFeedbackGetUnfinishedResponsesReturns;
