/** Trigger the submission viewed event. */
export interface ModWorkshopViewSubmissionParams {
    /** Submission id */
    submissionid: number | null;
}

export interface ModWorkshopViewSubmissionReturns {
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

export type ModWorkshopViewSubmissionReturn = ModWorkshopViewSubmissionReturns;
export type mod_workshop_view_submission_returns = ModWorkshopViewSubmissionReturns;
