/** Trigger the course module viewed event and update the module completion status. */
export interface ModLessonViewLessonParams {
    /** lesson instance id */
    lessonid: number | null;
    /** lesson password */
    password?: string | null;
}

export interface ModLessonViewLessonReturns {
    /** status: true if success */
    status: boolean | null;
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

export type ModLessonViewLessonReturn = ModLessonViewLessonReturns;
export type mod_lesson_view_lesson_returns = ModLessonViewLessonReturns;
