/** Return the final grade in the lesson for the given user. */
export interface ModLessonGetUserGradeParams {
    /** lesson instance id */
    lessonid: number | null;
    /** the user id (empty for current user) */
    userid?: number | null;
}

export interface ModLessonGetUserGradeReturns {
    /** The lesson final raw grade */
    grade: number | null;
    /** The lesson final grade formatted */
    formattedgrade: string | null;
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

export type ModLessonGetUserGradeReturn = ModLessonGetUserGradeReturns;
export type mod_lesson_get_user_grade_returns = ModLessonGetUserGradeReturns;
