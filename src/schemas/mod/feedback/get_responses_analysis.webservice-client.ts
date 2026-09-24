/** Return the feedback user responses analysis. */
export interface ModFeedbackGetResponsesAnalysisParams {
    /** Feedback instance id */
    feedbackid: number | null;
    /** Group id, 0 means that the function will determine the user group */
    groupid?: number | null;
    /** The page of records to return. */
    page?: number | null;
    /** The number of records to return per page */
    perpage?: number | null;
    /** Course where user completes the feedback (for site feedbacks only). */
    courseid?: number | null;
}

export interface ModFeedbackGetResponsesAnalysisReturns {
    attempts: Array<{
        /** Completed id */
        id: number | null;
        /** Course id */
        courseid: number | null;
        /** User who responded */
        userid: number | null;
        /** Time modified for the response */
        timemodified: number | null;
        /** User full name */
        fullname: string | null;
        responses: Array<{
            /** Response id */
            id: number | null;
            /** Response name */
            name: string | null;
            /** Response ready for output */
            printval: string | null;
            /** Response raw value */
            rawval: string | null;
        }>;
    }>;
    /** Total responses count. */
    totalattempts: number | null;
    anonattempts: Array<{
        /** Completed id */
        id: number | null;
        /** Course id */
        courseid: number | null;
        /** Response number */
        number: number | null;
        responses: Array<{
            /** Response id */
            id: number | null;
            /** Response name */
            name: string | null;
            /** Response ready for output */
            printval: string | null;
            /** Response raw value */
            rawval: string | null;
        }>;
    }>;
    /** Total anonymous responses count. */
    totalanonattempts: number | null;
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

export type ModFeedbackGetResponsesAnalysisReturn = ModFeedbackGetResponsesAnalysisReturns;
export type mod_feedback_get_responses_analysis_returns = ModFeedbackGetResponsesAnalysisReturns;
