/** Starts or continues a feedback submission. */
export interface ModFeedbackLaunchFeedbackParams {
    /** Feedback instance id */
    feedbackid: number | null;
    /** Course where user completes the feedback (for site feedbacks only). */
    courseid?: number | null;
}

export interface ModFeedbackLaunchFeedbackReturns {
    /** The next page to go (-1 if we were already in the last page). 0 for first page. */
    gopage: number | null;
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

export type ModFeedbackLaunchFeedbackReturn = ModFeedbackLaunchFeedbackReturns;
export type mod_feedback_launch_feedback_returns = ModFeedbackLaunchFeedbackReturns;
