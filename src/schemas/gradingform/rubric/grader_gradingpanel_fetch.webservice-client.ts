export interface GradingformRubricGraderGradingpanelFetchParams {
    /** The name of the component */
    component: string | null;
    /** The ID of the context being graded */
    contextid: number | null;
    /** The grade item itemname being graded */
    itemname: string | null;
    /** The ID of the user show */
    gradeduserid: number | null;
}

export interface GradingformRubricGraderGradingpanelFetchReturns {
    /** The template to use when rendering this data */
    templatename: string | null;
    /** Does the user have a grade? */
    hasgrade: boolean | null;
    grade: {
        /** The id of the current grading instance */
        instanceid: number | null;
        /** The mode i.e. evaluate editable */
        rubricmode: string | null;
        /** Can the user edit this */
        canedit: boolean | null;
        criteria: Array<{
            /** ID of the Criteria */
            id: number | null;
            /** Description of the Criteria */
            description: string | null;
            /** Any remarks for this criterion for the user being assessed */
            remark?: string | null;
            levels: Array<{
                /** ID of level */
                id: number | null;
                /** ID of the criterion this matches to */
                criterionid: number | null;
                /** What this level is worth */
                score: string | null;
                /** Definition of the level */
                definition: string | null;
                /** Selected flag */
                checked: boolean | null;
            }>;
        }>;
        /** The time that the grade was created */
        timecreated: number | null;
        /** Current user grade */
        usergrade: string | null;
        /** Max possible grade */
        maxgrade: string | null;
        /** The assumed grader of this grading instance */
        gradedby: string | null;
        /** The time that the grade was last updated */
        timemodified: number | null;
    };
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

export type GradingformRubricGraderGradingpanelFetchReturn = GradingformRubricGraderGradingpanelFetchReturns;
export type gradingform_rubric_grader_gradingpanel_fetch_returns = GradingformRubricGraderGradingpanelFetchReturns;
