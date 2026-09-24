/** Trigger the course module viewed event and update the module completion status. */
export interface ModFeedbackViewFeedbackParams {
    /** Feedback instance id */
    feedbackid: number | null;
    /** If we need to mark the module as viewed for completion */
    moduleviewed?: boolean | null;
    /** Course where user completes the feedback (for site feedbacks only). */
    courseid?: number | null;
}

export interface ModFeedbackViewFeedbackReturns {
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

export type ModFeedbackViewFeedbackReturn = ModFeedbackViewFeedbackReturns;
export type mod_feedback_view_feedback_returns = ModFeedbackViewFeedbackReturns;
