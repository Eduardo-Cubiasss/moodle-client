/** Update the flag state of a question attempt. */
export interface CoreQuestionUpdateFlagParams {
    /** the question usage id. */
    qubaid: number | null;
    /** the question id */
    questionid: number | null;
    /** the question_attempt id */
    qaid: number | null;
    /** the slot number within the usage */
    slot: number | null;
    /** computed checksum with the last three arguments and the users username */
    checksum: string | null;
    /** the new state of the flag. true = flagged */
    newstate: boolean | null;
}

export interface CoreQuestionUpdateFlagReturns {
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

export type CoreQuestionUpdateFlagReturn = CoreQuestionUpdateFlagReturns;
export type core_question_update_flag_returns = CoreQuestionUpdateFlagReturns;
