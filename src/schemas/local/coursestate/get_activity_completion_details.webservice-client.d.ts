/** What each activity asks of the student before it counts as done. */
export interface LocalCoursestateGetActivityCompletionDetailsParams {
    /** The courses whose completion rules to read */
    courseids: number | null[];
}

export interface LocalCoursestateGetActivityCompletionDetailsReturns {
    /** One entry per course the student is allowed to read */
    courses: Array<{
        /** The course */
        courseid: number | null;
        activities: Array<{
            /** The activity */
            cmid: number | null;
            /** What it asks, in the order Moodle lists it */
            criteria: Array<{
                /** What it asks, as Moodle words it */
                rule: string | null;
                /** Whether the student has done it */
                completed: boolean | null;
            }>;
        }>;
    }>;
}

export type LocalCoursestateGetActivityCompletionDetailsReturn = LocalCoursestateGetActivityCompletionDetailsReturns;
export type local_coursestate_get_activity_completion_details_returns = LocalCoursestateGetActivityCompletionDetailsReturns;
