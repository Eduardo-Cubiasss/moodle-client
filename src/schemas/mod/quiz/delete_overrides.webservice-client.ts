/** Delete quiz overrides */
export interface ModQuizDeleteOverridesParams {
    data: {
        /** ID of quiz to delete overrides in */
        quizid: number | null;
        ids: number | null[];
    };
}

export interface ModQuizDeleteOverridesReturns {
    ids: number | null[];
}

export type ModQuizDeleteOverridesReturn = ModQuizDeleteOverridesReturns;
export type mod_quiz_delete_overrides_returns = ModQuizDeleteOverridesReturns;
