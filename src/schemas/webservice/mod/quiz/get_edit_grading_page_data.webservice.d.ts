/** Get the data required to re-render the Quiz grading setup page */
export interface ModQuizGetEditGradingPageDataParams {
    /** The quiz for which to return the data. */
    quizid: number | null;
}

/** JSON-encoded data required to render the mod_quiz/edit_grading_page template. */
export type ModQuizGetEditGradingPageDataReturns = string | null;

export type ModQuizGetEditGradingPageDataReturn = ModQuizGetEditGradingPageDataReturns;
export type mod_quiz_get_edit_grading_page_data_returns = ModQuizGetEditGradingPageDataReturns;
