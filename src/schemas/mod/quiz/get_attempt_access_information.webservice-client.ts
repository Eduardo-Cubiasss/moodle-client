/** Return access information for a given attempt in a quiz. */
export interface ModQuizGetAttemptAccessInformationParams {
    /** quiz instance id */
    quizid: number | null;
    /** attempt id, 0 for the user last attempt if exists */
    attemptid?: number | null;
}

export interface ModQuizGetAttemptAccessInformationReturns {
    /** When the attempt must be submitted (determined by rules). */
    endtime?: number | null;
    /** Whether there is no way the user will ever be allowed to attempt. */
    isfinished: boolean | null;
    /** whether a check is required before the user starts/continues his attempt. */
    ispreflightcheckrequired?: boolean | null;
    /** list of reasons */
    preventnewattemptreasons: string | null[];
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

export type ModQuizGetAttemptAccessInformationReturn = ModQuizGetAttemptAccessInformationReturns;
export type mod_quiz_get_attempt_access_information_returns = ModQuizGetAttemptAccessInformationReturns;
