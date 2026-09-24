/** Retrieves the last completion record for the current user. */
export interface ModFeedbackGetLastCompletedParams {
    /** Feedback instance id */
    feedbackid: number | null;
    /** Course where user completes the feedback (for site feedbacks only). */
    courseid?: number | null;
}

export interface ModFeedbackGetLastCompletedReturns {
    completed: {
        /** The record id. */
        id: number;
        /** The feedback instance id this records belongs to. */
        feedback: number;
        /** The user who completed the feedback (0 for anonymous). */
        userid: number;
        /** The last time the feedback was completed. */
        timemodified: number;
        /** The response number (used when shuffling anonymous responses). */
        random_response: number;
        /** Whether is an anonymous response. */
        anonymous_response: number;
        /** The course id where the feedback was completed. */
        courseid: number;
    };
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

export type ModFeedbackGetLastCompletedReturn = ModFeedbackGetLastCompletedReturns;
export type mod_feedback_get_last_completed_returns = ModFeedbackGetLastCompletedReturns;
