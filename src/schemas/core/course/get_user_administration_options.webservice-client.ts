/** Return a list of administration options in a set of courses that are avaialable or not for the current user. */
export interface CoreCourseGetUserAdministrationOptionsParams {
    courseids: number | null[];
}

export interface CoreCourseGetUserAdministrationOptionsReturns {
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

export type CoreCourseGetUserAdministrationOptionsReturn = CoreCourseGetUserAdministrationOptionsReturns;
export type core_course_get_user_administration_options_returns = CoreCourseGetUserAdministrationOptionsReturns;
