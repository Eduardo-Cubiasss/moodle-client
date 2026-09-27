/** Delete quiz overrides */
export interface ModQuizDeleteOverridesParams {
    data: {
        /** ID of quiz to delete overrides in */
        quizid: number | null;
        ids: Array<number | null>;
    };
}

export interface ModQuizDeleteOverridesReturns {
    ids: Array<number | null>;
}

export type ModQuizDeleteOverridesReturn = ModQuizDeleteOverridesReturns;
export type mod_quiz_delete_overrides_returns = ModQuizDeleteOverridesReturns;
