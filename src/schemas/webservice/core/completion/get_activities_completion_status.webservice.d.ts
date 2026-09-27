/** Return the activities completion status for a user in a course. */
export interface CoreCompletionGetActivitiesCompletionStatusParams {
    /** Course ID */
    courseid: number | null;
    /** User ID */
    userid: number | null;
}

export interface CoreCompletionGetActivitiesCompletionStatusReturns {
    /** List of activities status */
    statuses: Array<{
        /** course module ID */
        cmid: number | null;
        /** activity module name */
        modname: string | null;
        /** instance ID */
        instance: number | null;
        /** Completion state value: 0 means incomplete, 1 complete, 2 complete pass, 3 complete fail */
        state: number | null;
        /** timestamp for completed activity */
        timecompleted: number | null;
        /** type of tracking: 0 means none, 1 manual, 2 automatic */
        tracking: number | null;
        /** The user id who has overriden the status, or null */
        overrideby?: number | null;
        /** Whether the completion status affects the availability of another activity. */
        valueused?: boolean | null;
        /** Whether this activity module has completion enabled */
        hascompletion?: boolean | null;
        /** Whether this activity module instance tracks completion automatically. */
        isautomatic?: boolean | null;
        /** Whether completion is being tracked for this user. */
        istrackeduser?: boolean | null;
        /** Whether this activity is visible to the user. */
        uservisible?: boolean | null;
        /** Completion status details */
        details?: Array<{
            /** Rule name */
            rulename: string | null;
            rulevalue: {
                /** Completion status */
                status: number | null;
                /** Completion description */
                description: string | null;
            };
        }>;
        /** Whether the overall completion state of this course module should be marked as complete or not. */
        isoverallcomplete?: boolean | null;
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

export type CoreCompletionGetActivitiesCompletionStatusReturn = CoreCompletionGetActivitiesCompletionStatusReturns;
export type core_completion_get_activities_completion_status_returns = CoreCompletionGetActivitiesCompletionStatusReturns;
