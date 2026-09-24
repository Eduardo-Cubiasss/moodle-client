/** Process responses during an attempt at a quiz and also deals with attempts finishing. */
export interface ModQuizProcessAttemptParams {
    /** attempt id */
    attemptid: number | null;
    /** the data to be saved */
    data?: Array<{
        /** data name */
        name: string | null;
        /** data value */
        value: string | null;
    }>;
    /** whether to finish or not the attempt */
    finishattempt?: boolean | null;
    /** whether the WS was called by a timer when the time is up */
    timeup?: boolean | null;
    /** Preflight required data (like passwords) */
    preflightdata?: Array<{
        /** data name */
        name: string | null;
        /** data value */
        value: string | null;
    }>;
}

export interface ModQuizProcessAttemptReturns {
    /** state: the new attempt state: inprogress, finished, overdue, abandoned */
    state: string | null;
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

export type ModQuizProcessAttemptReturn = ModQuizProcessAttemptReturns;
export type mod_quiz_process_attempt_returns = ModQuizProcessAttemptReturns;
