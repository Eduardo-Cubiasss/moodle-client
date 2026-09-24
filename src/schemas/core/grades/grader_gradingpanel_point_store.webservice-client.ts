/** Store the data required to display the grader grading panel for simple grading */
export interface CoreGradesGraderGradingpanelPointStoreParams {
    /** The name of the component */
    component: string | null;
    /** The ID of the context being graded */
    contextid: number | null;
    /** The grade item itemname being graded */
    itemname: string | null;
    /** The ID of the user show */
    gradeduserid: number | null;
    /** Wheteher to notify the user or not */
    notifyuser?: boolean | null;
    /** The serialised form data representing the grade */
    formdata: string | null;
}

export interface CoreGradesGraderGradingpanelPointStoreReturns {
    /** The template to use when rendering this data */
    templatename: string | null;
    /** Does the user have a grade? */
    hasgrade: boolean | null;
    grade: {
        /** The numeric grade */
        grade: number | null;
        /** Current user grade */
        usergrade: string | null;
        /** Max possible grade */
        maxgrade: string | null;
        /** The assumed grader of this grading instance */
        gradedby: string | null;
        /** The time that the grade was created */
        timecreated: number | null;
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

export type CoreGradesGraderGradingpanelPointStoreReturn = CoreGradesGraderGradingpanelPointStoreReturns;
export type core_grades_grader_gradingpanel_point_store_returns = CoreGradesGraderGradingpanelPointStoreReturns;
