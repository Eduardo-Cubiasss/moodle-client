/** Evaluates a submission (used by teachers for provide feedback or override the submission grade). */
export interface ModWorkshopEvaluateSubmissionParams {
    /** submission id. */
    submissionid: number | null;
    /** The feedback for the author. */
    feedbacktext?: string | null;
    /** The feedback format for text. */
    feedbackformat?: number | null;
    /** Publish the submission for others?. */
    published?: boolean | null;
    /** The new submission grade. */
    gradeover?: string | null;
}

export interface ModWorkshopEvaluateSubmissionReturns {
    /** status: true if the submission was evaluated, false otherwise. */
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

export type ModWorkshopEvaluateSubmissionReturn = ModWorkshopEvaluateSubmissionReturns;
export type mod_workshop_evaluate_submission_returns = ModWorkshopEvaluateSubmissionReturns;
