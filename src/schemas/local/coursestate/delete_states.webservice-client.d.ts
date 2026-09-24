/** Removes a batch of course states. Called by course-state-service. */
export interface LocalCoursestateDeleteStatesParams {
    /** The states to remove, by the student and course they are about */
    pairs: Array<{
        /** The student, by their Moodle id */
        userid: number | null;
        /** The course, by its Moodle id */
        courseid: number | null;
    }>;
}

export interface LocalCoursestateDeleteStatesReturns {
    /** How many of the pairs had a state here */
    statesremoved: number | null;
}

export type LocalCoursestateDeleteStatesReturn = LocalCoursestateDeleteStatesReturns;
export type local_coursestate_delete_states_returns = LocalCoursestateDeleteStatesReturns;
