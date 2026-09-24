/** Set the version of question that would be required for a given quiz. */
export interface ModQuizSetQuestionVersionParams {
    slotid: number | null;
    newversion: number | null;
}

export interface ModQuizSetQuestionVersionReturns {
    result: boolean | null;
}

export type ModQuizSetQuestionVersionReturn = ModQuizSetQuestionVersionReturns;
export type mod_quiz_set_question_version_returns = ModQuizSetQuestionVersionReturns;
