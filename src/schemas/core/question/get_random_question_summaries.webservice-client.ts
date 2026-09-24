/** Get the random question set for a criteria */
export interface CoreQuestionGetRandomQuestionSummariesParams {
    /** Category id to find random questions */
    categoryid: number | null;
    /** Include the subcategories in the search */
    includesubcategories: boolean | null;
    tagids: number | null[];
    /** Context id that the questions will be rendered in (used for exporting) */
    contextid: number | null;
    /** Maximum number of results to return */
    limit?: number | null;
    /** Number of items to skip from the begging of the result set */
    offset?: number | null;
}

export interface CoreQuestionGetRandomQuestionSummariesReturns {
    /** total number of questions in result set */
    totalcount: number | null;
    questions: Array<{
        /** id */
        id: number;
        /** category */
        category: number;
        /** parent */
        parent: number;
        /** name */
        name: string;
        /** qtype */
        qtype: string;
        icon: {
            /** key */
            key: string;
            /** component */
            component: string;
            /** alttext */
            alttext: string;
        };
    }>;
}

export type CoreQuestionGetRandomQuestionSummariesReturn = CoreQuestionGetRandomQuestionSummariesReturns;
export type core_question_get_random_question_summaries_returns = CoreQuestionGetRandomQuestionSummariesReturns;
