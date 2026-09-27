/** Get the best current grade for the given user on a quiz. */
export interface ModQuizGetUserBestGradeParams {
    /** quiz instance id */
    quizid: number | null;
    /** user id */
    userid?: number | null;
}

export interface ModQuizGetUserBestGradeReturns {
    /** Whether the user has a grade on the given quiz. */
    hasgrade: boolean | null;
    /** The grade (only if the user has a grade). */
    grade?: number | null;
    /** The grade to pass the quiz (only if set). */
    gradetopass?: number | null;
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

export type ModQuizGetUserBestGradeReturn = ModQuizGetUserBestGradeReturns;
export type mod_quiz_get_user_best_grade_returns = ModQuizGetUserBestGradeReturns;
