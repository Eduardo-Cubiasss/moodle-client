/** Processes save requests during the quiz. This function is intended for the quiz auto-save feature. */
export interface ModQuizSaveAttemptParams {
    /** attempt id */
    attemptid: number | null;
    /** the data to be saved */
    data: Array<{
        /** data name */
        name: string | null;
        /** data value */
        value: string | null;
    }>;
    /** Preflight required data (like passwords) */
    preflightdata?: Array<{
        /** data name */
        name: string | null;
        /** data value */
        value: string | null;
    }>;
}

export interface ModQuizSaveAttemptReturns {
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

export type ModQuizSaveAttemptReturn = ModQuizSaveAttemptReturns;
export type mod_quiz_save_attempt_returns = ModQuizSaveAttemptReturns;
