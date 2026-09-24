/** Records that the student who is asking is starting a course. */
export interface LocalCoursestateStartCourseParams {
    /** The course, by its Moodle id */
    courseid?: number | null;
    /** The course, as the campus knows it. Only used when no courseid is given */
    courseidnumber?: string | null;
}

export interface LocalCoursestateStartCourseReturns {
    /** Whether the student may now open it */
    started: boolean | null;
    /** What their state is now, empty when there is none */
    state: string | null;
}

export type LocalCoursestateStartCourseReturn = LocalCoursestateStartCourseReturns;
export type local_coursestate_start_course_returns = LocalCoursestateStartCourseReturns;
