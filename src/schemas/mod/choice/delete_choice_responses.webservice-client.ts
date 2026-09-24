/** Delete the given submitted responses in a choice */
export interface ModChoiceDeleteChoiceResponsesParams {
    /** choice instance id */
    choiceid: number | null;
    /** Array of response ids, empty for deleting all the current user responses. */
    responses?: number | null[];
}

export interface ModChoiceDeleteChoiceResponsesReturns {
    /** status, true if everything went right */
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

export type ModChoiceDeleteChoiceResponsesReturn = ModChoiceDeleteChoiceResponsesReturns;
export type mod_choice_delete_choice_responses_returns = ModChoiceDeleteChoiceResponsesReturns;
