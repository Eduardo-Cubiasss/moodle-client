/** Retrieves responses from the last finished attempt. */
export interface ModFeedbackGetFinishedResponsesParams {
    /** Feedback instance id. */
    feedbackid: number | null;
    /** Course where user completes the feedback (for site feedbacks only). */
    courseid?: number | null;
}

export interface ModFeedbackGetFinishedResponsesReturns {
    responses: Array<{
        /** The record id. */
        id: number;
        /** The course id this record belongs to. */
        course_id: number;
        /** The item id that was responded. */
        item: number;
        /** Reference to the feedback_completed table. */
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

export type ModFeedbackGetFinishedResponsesReturn = ModFeedbackGetFinishedResponsesReturns;
export type mod_feedback_get_finished_responses_returns = ModFeedbackGetFinishedResponsesReturns;
