/** Retrieve users results for a given choice. */
export interface ModChoiceGetChoiceResultsParams {
    /** choice instance id */
    choiceid: number | null;
}

export interface ModChoiceGetChoiceResultsReturns {
    options: Array<{
        /** choice instance id */
        id: number | null;
        /** text of the choice */
        text: string | null;
        /** maximum number of answers */
        maxanswer: number | null;
        userresponses: Array<{
            /** user id */
            userid: number | null;
            /** user full name */
            fullname: string | null;
            /** profile user image url */
            profileimageurl: string | null;
            /** answer id */
            answerid?: number | null;
            /** time of modification */
            timemodified?: number | null;
        }>;
        /** number of users answers */
        numberofuser: number | null;
        /** percentage of users answers */
        percentageamount: number | null;
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

export type ModChoiceGetChoiceResultsReturn = ModChoiceGetChoiceResultsReturns;
export type mod_choice_get_choice_results_returns = ModChoiceGetChoiceResultsReturns;
