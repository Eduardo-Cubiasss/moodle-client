/** What the student who is asking may do with one course. */
export interface LocalCoursestateGetCourseStateParams {
    /** The course, as the campus knows it */
    courseidnumber: string | null;
}

export interface LocalCoursestateGetCourseStateReturns {
    /** Whether the student has any state in it */
    found: boolean | null;
    /** What they may do with it */
    state: string | null;
    /** Why, when the state needs saying */
    reason?: string | null;
    /** Its activities, in the order the course shows them */
    modules: Array<{
        /** The activity */
        cmid: number | null;
        /** Whether the student has done it */
        completed: boolean | null;
        /** Where it sits in the course, from one */
        position: number | null;
    }>;
}

export type LocalCoursestateGetCourseStateReturn = LocalCoursestateGetCourseStateReturns;
export type local_coursestate_get_course_state_returns = LocalCoursestateGetCourseStateReturns;
