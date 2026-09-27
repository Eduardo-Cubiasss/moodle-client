/** Get the complete list of questions for the survey, including subquestions. */
export interface ModSurveyGetQuestionsParams {
    /** survey instance id */
    surveyid: number | null;
}

export interface ModSurveyGetQuestionsReturns {
    questions: Array<{
        /** Question id */
        id: number | null;
        /** Question text */
        text: string | null;
        /** Question short text */
        shorttext: string | null;
        /** Subquestions ids */
        multi: string | null;
        /** The question intro */
        intro: string | null;
        /** Question type */
        type: number | null;
        /** Question options */
        options: string | null;
        /** Parent question (for subquestions) */
        parent: number | null;
    }>;
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

export type ModSurveyGetQuestionsReturn = ModSurveyGetQuestionsReturns;
export type mod_survey_get_questions_returns = ModSurveyGetQuestionsReturns;
