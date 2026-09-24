/** Update quiz grade items. All grade items must belong to the same quiz. */
export interface ModQuizUpdateGradeItemsParams {
    /** The quiz to update slots for. */
    quizid: number | null;
    quizgradeitems: Array<{
        /** id of the quiz grade item */
        id: number | null;
        /** If passed, new name to set. Null, or not specified, to leave unchanged. */
        name?: string | null;
    }>;
}

export type ModQuizUpdateGradeItemsReturns = unknown;

export type ModQuizUpdateGradeItemsReturn = ModQuizUpdateGradeItemsReturns;
export type mod_quiz_update_grade_items_returns = ModQuizUpdateGradeItemsReturns;
