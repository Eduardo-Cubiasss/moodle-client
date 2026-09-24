/** How far through each of their courses the student who is asking is. Asked after the tree, so the page is usable before the figures arrive. */
export interface LocalCoursestateGetStudentProgressParams {}

export interface LocalCoursestateGetStudentProgressReturns {
    /** One entry per course of the tree */
    courses: Array<{
        /** The course */
        courseid: number | null;
        /** Whether it tracks anything */
        hasprogress: boolean | null;
        /** Activities done over activities counted */
        progresspercent: number | null;
        /** How many of its activities count */
        trackedactivities: number | null;
        /** How many of those are done */
        completedactivities: number | null;
        /** How many arrived since they last looked */
        newactivities: number | null;
        /** How many were marked since they last looked */
        correctedactivities: number | null;
    }>;
    induction: {
        /** Whether there is a figure at all */
        hasprogress: boolean | null;
        /** Courses finished over courses shown */
        progresspercent: number | null;
        /** How many of its courses count */
        coursestotal: number | null;
        /** How many of those are done */
        coursescomplete: number | null;
    };
    other: {
        /** Whether there is a figure at all */
        hasprogress: boolean | null;
        /** Courses finished over courses shown */
        progresspercent: number | null;
        /** How many of its courses count */
        coursestotal: number | null;
        /** How many of those are done */
        coursescomplete: number | null;
    };
}

export type LocalCoursestateGetStudentProgressReturn = LocalCoursestateGetStudentProgressReturns;
export type local_coursestate_get_student_progress_returns = LocalCoursestateGetStudentProgressReturns;
