/** Writes the two decisions the service still owns: FINALIZED, and CLOSED for a recognized subject. Called by course-state-service. */
export interface LocalCoursestatePushStatesParams {
    /** The states to write */
    states?: Array<{
        /** The student, by their Moodle id */
        userid: number | null;
        /** The course, by its Moodle id */
        courseid: number | null;
        /** FINALIZED or RECOGNIZED. CLOSED with reason RECOGNIZED_SUBJECT is still accepted and read as RECOGNIZED */
        state: string | null;
        /** RECOGNIZED_SUBJECT, only for the legacy CLOSED shape. Otherwise left out */
        reason?: string | null;
        /** That the service is still working the real state out */
        provisional?: boolean | null;
        /** When it last became something else. Now, when left out */
        statechangedat?: number | null;
    }>;
    /** The programme progress to write. Ignored: this plugin counts it */
    programs?: Array<{
        /** The student, by their Moodle id */
        userid: number | null;
        /** The course that represents the programme itself */
        courseid: number | null;
        /** How many subjects the plan has */
        coursestotal: number | null;
        /** How many of them they have finalised */
        coursescomplete: number | null;
    }>;
}

export interface LocalCoursestatePushStatesReturns {
    /** How many states were new or different */
    stateswritten: number | null;
    /** How many progress rows were new or different */
    programswritten: number | null;
}

export type LocalCoursestatePushStatesReturn = LocalCoursestatePushStatesReturns;
export type local_coursestate_push_states_returns = LocalCoursestatePushStatesReturns;
