/** Update the course completion status for the current user (if course self-completion is enabled). */
export interface CoreCompletionMarkCourseSelfCompletedParams {
    /** Course ID */
    courseid: number | null;
}

export interface CoreCompletionMarkCourseSelfCompletedReturns {
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

export type CoreCompletionMarkCourseSelfCompletedReturn = CoreCompletionMarkCourseSelfCompletedReturns;
export type core_completion_mark_course_self_completed_returns = CoreCompletionMarkCourseSelfCompletedReturns;
