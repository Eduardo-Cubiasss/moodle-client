/** Trigger the attempt viewed event. */
export interface ModQuizViewAttemptParams {
    /** attempt id */
    attemptid: number | null;
    /** page number */
    page: number | null;
    /** Preflight required data (like passwords) */
    preflightdata?: Array<{
        /** data name */
        name: string | null;
        /** data value */
        value: string | null;
    }>;
}

export interface ModQuizViewAttemptReturns {
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

export type ModQuizViewAttemptReturn = ModQuizViewAttemptReturns;
export type mod_quiz_view_attempt_returns = ModQuizViewAttemptReturns;
