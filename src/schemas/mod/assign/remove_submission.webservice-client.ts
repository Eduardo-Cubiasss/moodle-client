/** Remove submission. */
export interface ModAssignRemoveSubmissionParams {
    /** User id */
    userid: number | null;
    /** Assignment instance id */
    assignid: number | null;
}

export interface ModAssignRemoveSubmissionReturns {
    /** True if the submission was successfully removed and false if was not. */
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

export type ModAssignRemoveSubmissionReturn = ModAssignRemoveSubmissionReturns;
export type mod_assign_remove_submission_returns = ModAssignRemoveSubmissionReturns;
