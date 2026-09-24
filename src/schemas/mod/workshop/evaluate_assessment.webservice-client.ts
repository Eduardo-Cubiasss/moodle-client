/** Evaluates an assessment (used by teachers for provide feedback to the reviewer). */
export interface ModWorkshopEvaluateAssessmentParams {
    /** Assessment id. */
    assessmentid: number | null;
    /** The feedback for the reviewer. */
    feedbacktext?: string | null;
    /** The feedback format for text. */
    feedbackformat?: number | null;
    /** The new weight for the assessment. */
    weight?: number | null;
    /** The new grading grade. */
    gradinggradeover?: string | null;
}

export interface ModWorkshopEvaluateAssessmentReturns {
    /** status: true if the assessment was evaluated, false otherwise. */
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

export type ModWorkshopEvaluateAssessmentReturn = ModWorkshopEvaluateAssessmentReturns;
export type mod_workshop_evaluate_assessment_returns = ModWorkshopEvaluateAssessmentReturns;
