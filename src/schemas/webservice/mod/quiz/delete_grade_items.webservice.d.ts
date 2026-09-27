/** Delete quiz grade items. All grade items must belong to the same quiz. */
export interface ModQuizDeleteGradeItemsParams {
    /** The quiz to update slots for. */
    quizid: number | null;
    quizgradeitems: Array<{
        /** id of the quiz grade item */
        id: number | null;
    }>;
}

export type ModQuizDeleteGradeItemsReturns = unknown;

export type ModQuizDeleteGradeItemsReturn = ModQuizDeleteGradeItemsReturns;
export type mod_quiz_delete_grade_items_returns = ModQuizDeleteGradeItemsReturns;
