/** Trigger the report view event */
export interface GradereportUserViewGradeReportParams {
    /** id of the course */
    courseid: number | null;
    /** id of the user, 0 means current user */
    userid?: number | null;
}

export interface GradereportUserViewGradeReportReturns {
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

export type GradereportUserViewGradeReportReturn = GradereportUserViewGradeReportReturns;
export type gradereport_user_view_grade_report_returns = GradereportUserViewGradeReportReturns;
