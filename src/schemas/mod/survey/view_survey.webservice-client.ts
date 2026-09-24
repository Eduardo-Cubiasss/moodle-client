/** Trigger the course module viewed event and update the module completion status. */
export interface ModSurveyViewSurveyParams {
    /** survey instance id */
    surveyid: number | null;
}

export interface ModSurveyViewSurveyReturns {
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

export type ModSurveyViewSurveyReturn = ModSurveyViewSurveyReturns;
export type mod_survey_view_survey_returns = ModSurveyViewSurveyReturns;
