/** Process a jump between pages. */
export interface ModFeedbackProcessPageParams {
    /** Feedback instance id. */
    feedbackid: number | null;
    /** The page being processed. */
    page: number | null;
    /** The data to be processed. */
    responses?: Array<{
        /** The response name (usually type[index]_id). */
        name: string | null;
        /** The response value. */
        value: string | null;
    }>;
    /** Whether we want to jump to previous page. */
    goprevious?: boolean | null;
    /** Course where user completes the feedback (for site feedbacks only). */
    courseid?: number | null;
}

export interface ModFeedbackProcessPageReturns {
    /** The page to jump to. */
    jumpto: number | null;
    /** If the user completed the feedback. */
    completed: boolean | null;
    /** The completion page contents. */
    completionpagecontents: string | null;
    /** The link (could be relative) to show after submit. */
    siteaftersubmit: string | null;
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

export type ModFeedbackProcessPageReturn = ModFeedbackProcessPageReturns;
export type mod_feedback_process_page_returns = ModFeedbackProcessPageReturns;
