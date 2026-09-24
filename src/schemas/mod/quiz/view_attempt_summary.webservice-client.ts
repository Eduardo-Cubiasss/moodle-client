/** Trigger the attempt summary viewed event. */
export interface ModQuizViewAttemptSummaryParams {
    /** attempt id */
    attemptid: number | null;
    /** Preflight required data (like passwords) */
    preflightdata?: Array<{
        /** data name */
        name: string | null;
        /** data value */
        value: string | null;
    }>;
}

export interface ModQuizViewAttemptSummaryReturns {
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

export type ModQuizViewAttemptSummaryReturn = ModQuizViewAttemptSummaryReturns;
export type mod_quiz_view_attempt_summary_returns = ModQuizViewAttemptSummaryReturns;
