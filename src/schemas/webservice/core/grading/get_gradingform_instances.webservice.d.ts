/** Get grading form instances */
export interface CoreGradingGetGradingformInstancesParams {
    /** definition id */
    definitionid: number | null;
    /** submitted since */
    since?: number | null;
}

export interface CoreGradingGetGradingformInstancesReturns {
    /** list of grading instances */
    instances: Array<{
        /** instance id */
        id: number | null;
        /** rater id */
        raterid: number | null;
        /** item id */
        itemid: number | null;
        /** raw grade */
        rawgrade?: string | null;
        /** status */
        status: number | null;
        /** feedback */
        feedback?: string | null;
        /** feedback format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        feedbackformat?: number | null;
        /** modified time */
        timemodified: number | null;
        /** items */
        guide?: {
            /** filling */
            criteria?: Array<{
                /** filling id */
                id: number | null;
                /** criterion id */
                criterionid: number | null;
                /** level id */
                levelid?: number | null;
                /** remark */
                remark?: string | null;
                /** remark format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                remarkformat?: number | null;
                /** maximum score */
                score: number | null;
            }>;
        };
        /** items */
        rubric?: {
            /** filling */
            criteria?: Array<{
                /** filling id */
                id: number | null;
                /** criterion id */
                criterionid: number | null;
                /** level id */
                levelid?: number | null;
                /** remark */
                remark?: string | null;
                /** remark format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                remarkformat?: number | null;
            }>;
        };
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

export type CoreGradingGetGradingformInstancesReturn = CoreGradingGetGradingformInstancesReturns;
export type core_grading_get_gradingform_instances_returns = CoreGradingGetGradingformInstancesReturns;
