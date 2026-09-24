/** Trigger the course module viewed event and update the module completion status. */
export interface ModQuizViewQuizParams {
    /** quiz instance id */
    quizid: number | null;
}

export interface ModQuizViewQuizReturns {
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

export type ModQuizViewQuizReturn = ModQuizViewQuizReturns;
export type mod_quiz_view_quiz_returns = ModQuizViewQuizReturns;
