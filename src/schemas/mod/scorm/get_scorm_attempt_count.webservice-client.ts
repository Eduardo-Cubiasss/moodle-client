/** Return the number of attempts done by a user in the given SCORM. */
export interface ModScormGetScormAttemptCountParams {
    /** SCORM instance id */
    scormid: number | null;
    /** User id */
    userid: number | null;
    /** Ignores attempts that haven't reported a grade/completion */
    ignoremissingcompletion?: boolean | null;
}

export interface ModScormGetScormAttemptCountReturns {
    /** Attempts count */
    attemptscount: number | null;
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

export type ModScormGetScormAttemptCountReturn = ModScormGetScormAttemptCountReturns;
export type mod_scorm_get_scorm_attempt_count_returns = ModScormGetScormAttemptCountReturns;
