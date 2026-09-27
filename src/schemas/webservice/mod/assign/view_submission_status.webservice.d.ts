/** Trigger the submission status viewed event. */
export interface ModAssignViewSubmissionStatusParams {
    /** assign instance id */
    assignid: number | null;
}

export interface ModAssignViewSubmissionStatusReturns {
    /** status: true if success */
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

export type ModAssignViewSubmissionStatusReturn = ModAssignViewSubmissionStatusReturns;
export type mod_assign_view_submission_status_returns = ModAssignViewSubmissionStatusReturns;
