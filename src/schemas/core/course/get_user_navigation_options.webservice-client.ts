/** Return a list of navigation options in a set of courses that are avaialable or not for the current user. */
export interface CoreCourseGetUserNavigationOptionsParams {
    courseids: number | null[];
}

export interface CoreCourseGetUserNavigationOptionsReturns {
    /** List of courses */
    courses: Array<{
        /** Course id */
        id: number | null;
        options: Array<{
            /** Option name */
            name: string | null;
            /** Whether the option is available or not */
            available: boolean | null;
        }>;
    }>;
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

export type CoreCourseGetUserNavigationOptionsReturn = CoreCourseGetUserNavigationOptionsReturns;
export type core_course_get_user_navigation_options_returns = CoreCourseGetUserNavigationOptionsReturns;
