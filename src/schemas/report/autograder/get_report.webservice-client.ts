/** One page of the autograder report, for an activity, a course or the site. */
export interface ReportAutograderGetReportParams {
    /** One activity, or 0 */
    cmid?: number | null;
    /** One course, or 0 */
    courseid?: number | null;
    /** Zero-based page number */
    page?: number | null;
    /** Rows per page (0 = default) */
    limit?: number | null;
    /** What to narrow the table to */
    filters?: Array<{
        /** Which filter */
        name: string | null;
        /** What to narrow it to */
        value: string | null;
    }>;
    /** user_name, completed_at_sort, or empty */
    sortcolumn?: string | null;
    /** asc or desc */
    sortdir?: string | null;
}

export interface ReportAutograderGetReportReturns {
    /** Rows the report has, before paging */
    totalrecords: number | null;
    /** Rows on this page */
    limit: number | null;
    /** Which page this is */
    page: number | null;
    data: Array<{
        /** Unique per activity and student */
        rowkey: string | null;
        /** The student column, picture and name */
        user_col: string | null;
        /** The student, as text */
        user_name: string | null;
        /** Their profile */
        user_profile_url: string | null;
        /** Their picture */
        user_picture_url: string | null;
        /** The student */
        moodle_userid: number | null;
        /** The course */
        courseid: number | null;
        /** The activity instance */
        instanceid: number | null;
        /** The activity type */
        modname: string | null;
        /** What the badge says */
        status: string | null;
        /** What the badge means */
        status_key: string | null;
        /** How the badge looks */
        status_class: string | null;
        /** The date, formatted */
        completed_at: string | null;
        /** The date, for sorting */
        completed_at_sort: number | null;
        /** Why that date */
        date_reason?: string | null;
        /** The grade the student has */
        grade?: string | null;
        /** The grade they are going to get */
        provisional_grade?: string | null;
        /** Why no grade can be promised */
        grade_problem?: string | null;
        /** The teacher it was graded as */
        graded_by?: string | null;
        /** The teacher it is going to be graded as */
        will_grade?: string | null;
        /** Why nobody can be named yet */
        will_grade_problem?: string | null;
        /** Whether the table has a group column */
        shows_groups?: boolean | null;
        /** The student's groups in this activity */
        groups?: string | null;
        /** Why it failed */
        failure_reason?: string | null;
        /** The activity */
        activity_name?: string | null;
        /** That activity's own report */
        activity_url?: string | null;
        /** The course */
        course_name?: string | null;
        /** That course's own report */
        course_url?: string | null;
        /** The activity grading screen */
        grade_user_url?: string | null;
        /** Launch the forum grader */
        show_forum_grader?: boolean | null;
    }>;
}

export type ReportAutograderGetReportReturn = ReportAutograderGetReportReturns;
export type report_autograder_get_report_returns = ReportAutograderGetReportReturns;
