/** Returns course completion status. */
export interface CoreCompletionGetCourseCompletionStatusParams {
    /** Course ID */
    courseid: number | null;
    /** User ID */
    userid: number | null;
}

/** Course completion status */
export interface CoreCompletionGetCourseCompletionStatusReturns {
    /** Course status */
    completionstatus: {
        /** true if the course is complete, false otherwise */
        completed: boolean | null;
        /** aggregation method 1 means all, 2 means any */
        aggregation: number | null;
        completions: Array<{
            /** Completion criteria type */
            type: number | null;
            /** Completion criteria Title */
            title: string | null;
            /** Completion status (Yes/No) a % or number */
            status: string | null;
            /** Completion status (true/false) */
            complete: boolean | null;
            /** Timestamp for criteria completetion */
            timecompleted: number | null;
            /** details */
            details: {
                /** Type description */
                type: string | null;
                /** Criteria description */
                criteria: string | null;
                /** Requirement description */
                requirement: string | null;
                /** Status description, can be anything */
                status: string | null;
            };
        }>;
    };
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

export type CoreCompletionGetCourseCompletionStatusReturn = CoreCompletionGetCourseCompletionStatusReturns;
export type core_completion_get_course_completion_status_returns = CoreCompletionGetCourseCompletionStatusReturns;
