/** Update completion status for a user in an activity by overriding it. */
export interface CoreCompletionOverrideActivityCompletionStatusParams {
    /** user id */
    userid: number | null;
    /** course module id */
    cmid: number | null;
    /** the new activity completion state */
    newstate: number | null;
}

export interface CoreCompletionOverrideActivityCompletionStatusReturns {
    /** The course module id */
    cmid: number | null;
    /** The user id to which the completion info belongs */
    userid: number | null;
    /** The current completion state. */
    state: number | null;
    /** time of completion */
    timecompleted: number | null;
    /** The user id who has overriden the status, or null */
    overrideby: number | null;
    /** type of tracking: 0 means none, 1 manual, 2 automatic */
    tracking: number | null;
}

export type CoreCompletionOverrideActivityCompletionStatusReturn = CoreCompletionOverrideActivityCompletionStatusReturns;
export type core_completion_override_activity_completion_status_returns = CoreCompletionOverrideActivityCompletionStatusReturns;
