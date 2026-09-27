/** Deletes the given submission. */
export interface ModWorkshopDeleteSubmissionParams {
    /** Submission id */
    submissionid: number | null;
}

export interface ModWorkshopDeleteSubmissionReturns {
    /** True if the submission was deleted. */
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

export type ModWorkshopDeleteSubmissionReturn = ModWorkshopDeleteSubmissionReturns;
export type mod_workshop_delete_submission_returns = ModWorkshopDeleteSubmissionReturns;
