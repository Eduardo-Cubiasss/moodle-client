/** Create quiz grade items. All grade items must belong to the same quiz. */
export interface ModQuizCreateGradeItemsParams {
    /** The quiz to update slots for. */
    quizid: number | null;
    quizgradeitems: Array<{
        /** The name for the grade item to create. If empty string, a sensible default is used. */
        name: string | null;
    }>;
}

export type ModQuizCreateGradeItemsReturns = unknown;

export type ModQuizCreateGradeItemsReturn = ModQuizCreateGradeItemsReturns;
export type mod_quiz_create_grade_items_returns = ModQuizCreateGradeItemsReturns;
