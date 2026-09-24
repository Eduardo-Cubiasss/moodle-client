/** Deletes all specified courses */
export interface CoreCourseDeleteCoursesParams {
    courseids: number | null[];
}

export interface CoreCourseDeleteCoursesReturns {
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

export type CoreCourseDeleteCoursesReturn = CoreCourseDeleteCoursesReturns;
export type core_course_delete_courses_returns = CoreCourseDeleteCoursesReturns;
