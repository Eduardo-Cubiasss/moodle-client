/** Saves the new order of the questions in the feedback. */
export interface ModFeedbackQuestionsReorderParams {
    /** Feedback course module id */
    cmid: number | null;
    /** Feedback order by sequence of question item ids */
    itemorder: string | null;
}

export type ModFeedbackQuestionsReorderReturns = boolean | null;

export type ModFeedbackQuestionsReorderReturn = ModFeedbackQuestionsReorderReturns;
export type mod_feedback_questions_reorder_returns = ModFeedbackQuestionsReorderReturns;
