/** Return the potential question types that would be required for a given quiz. */
export interface ModQuizGetQuizRequiredQtypesParams {
    /** quiz instance id */
    quizid: number | null;
}

export interface ModQuizGetQuizRequiredQtypesReturns {
    /** list of question types used in the quiz */
    questiontypes: string | null[];
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

export type ModQuizGetQuizRequiredQtypesReturn = ModQuizGetQuizRequiredQtypesReturns;
export type mod_quiz_get_quiz_required_qtypes_returns = ModQuizGetQuizRequiredQtypesReturns;
