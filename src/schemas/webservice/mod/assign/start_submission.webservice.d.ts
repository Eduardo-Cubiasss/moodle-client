/** Start a submission for user if assignment has a time limit. */
export interface ModAssignStartSubmissionParams {
    /** Assignment instance id */
    assignid: number | null;
}

export interface ModAssignStartSubmissionReturns {
    /** New submission ID. */
    submissionid: number | null;
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

export type ModAssignStartSubmissionReturn = ModAssignStartSubmissionReturns;
export type mod_assign_start_submission_returns = ModAssignStartSubmissionReturns;
