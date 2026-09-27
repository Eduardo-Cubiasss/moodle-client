/** Log that the course was viewed */
export interface CoreCourseViewCourseParams {
    /** id of the course */
    courseid: number | null;
    /** section number */
    sectionnumber?: number | null;
}

export interface CoreCourseViewCourseReturns {
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

export type CoreCourseViewCourseReturn = CoreCourseViewCourseReturns;
export type core_course_view_course_returns = CoreCourseViewCourseReturns;
