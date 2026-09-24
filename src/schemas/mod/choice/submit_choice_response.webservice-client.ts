/** Submit responses to a specific choice item. */
export interface ModChoiceSubmitChoiceResponseParams {
    /** choice instance id */
    choiceid: number | null;
    /** Array of response ids */
    responses: number | null[];
}

export interface ModChoiceSubmitChoiceResponseReturns {
    answers: Array<{
        /** answer id */
        id: number | null;
        /** choiceid */
        choiceid: number | null;
        /** user id */
        userid: number | null;
        /** optionid */
        optionid: number | null;
        /** time of last modification */
        timemodified: number | null;
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

export type ModChoiceSubmitChoiceResponseReturn = ModChoiceSubmitChoiceResponseReturns;
export type mod_choice_submit_choice_response_returns = ModChoiceSubmitChoiceResponseReturns;
