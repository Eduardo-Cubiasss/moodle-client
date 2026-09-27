/** Submit the answers for a given survey. */
export interface ModSurveySubmitAnswersParams {
    /** Survey id */
    surveyid: number | null;
    answers: Array<{
        /** Answer key */
        key: string | null;
        /** Answer value */
        value: string | null;
    }>;
}

export interface ModSurveySubmitAnswersReturns {
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

export type ModSurveySubmitAnswersReturn = ModSurveySubmitAnswersReturns;
export type mod_survey_submit_answers_returns = ModSurveySubmitAnswersReturns;
