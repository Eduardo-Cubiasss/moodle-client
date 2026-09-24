/** Update the given submission. */
export interface ModWorkshopUpdateSubmissionParams {
    /** Submission id */
    submissionid: number | null;
    /** Submission title */
    title: string | null;
    /** Submission text content */
    content?: string | null;
    /** The format used for the content */
    contentformat?: number | null;
    /** The draft file area id for inline attachments in the content */
    inlineattachmentsid?: number | null;
    /** The draft file area id for attachments */
    attachmentsid?: number | null;
}

export interface ModWorkshopUpdateSubmissionReturns {
    /** True if the submission was updated false otherwise. */
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

export type ModWorkshopUpdateSubmissionReturn = ModWorkshopUpdateSubmissionReturns;
export type mod_workshop_update_submission_returns = ModWorkshopUpdateSubmissionReturns;
