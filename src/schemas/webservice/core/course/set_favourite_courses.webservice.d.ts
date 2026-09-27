/** Add a list of courses to the list of favourite courses. */
export interface CoreCourseSetFavouriteCoursesParams {
    courses: Array<{
        /** course ID */
        id: number | null;
        /** favourite status */
        favourite: boolean | null;
    }>;
}

export interface CoreCourseSetFavouriteCoursesReturns {
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

export type CoreCourseSetFavouriteCoursesReturn = CoreCourseSetFavouriteCoursesReturns;
export type core_course_set_favourite_courses_returns = CoreCourseSetFavouriteCoursesReturns;
