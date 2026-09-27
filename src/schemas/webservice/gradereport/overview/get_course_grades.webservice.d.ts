/** Get the given user courses final grades */
export interface GradereportOverviewGetCourseGradesParams {
    /** Get grades for this user (optional, default current) */
    userid?: number | null;
}

export interface GradereportOverviewGetCourseGradesReturns {
    grades: Array<{
        /** Course id */
        courseid: number | null;
        /** Grade formatted */
        grade: string | null;
        /** Raw grade, not formatted */
        rawgrade: string | null;
        /** Your rank in the course */
        rank?: number | null;
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

export type GradereportOverviewGetCourseGradesReturn = GradereportOverviewGetCourseGradesReturns;
export type gradereport_overview_get_course_grades_returns = GradereportOverviewGetCourseGradesReturns;
