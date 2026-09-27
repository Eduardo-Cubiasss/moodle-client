/** Update completion status for the current user in an activity, only for activities with manual tracking. */
export interface CoreCompletionUpdateActivityCompletionStatusManuallyParams {
    /** course module id */
    cmid: number | null;
    /** activity completed or not */
    completed: boolean | null;
}

export interface CoreCompletionUpdateActivityCompletionStatusManuallyReturns {
    /** status, true if success */
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

export type CoreCompletionUpdateActivityCompletionStatusManuallyReturn = CoreCompletionUpdateActivityCompletionStatusManuallyReturns;
export type core_completion_update_activity_completion_status_manually_returns = CoreCompletionUpdateActivityCompletionStatusManuallyReturns;
