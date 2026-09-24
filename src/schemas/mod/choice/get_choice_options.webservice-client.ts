/** Retrieve options for a specific choice. */
export interface ModChoiceGetChoiceOptionsParams {
    /** choice instance id */
    choiceid: number | null;
}

export interface ModChoiceGetChoiceOptionsReturns {
    /** Options */
    options: Array<{
        /** option id */
        id: number | null;
        /** text of the choice */
        text: string | null;
        /** maximum number of answers */
        maxanswers: number | null;
        /** true for orizontal, otherwise vertical */
        displaylayout: boolean | null;
        /** number of answers */
        countanswers: number | null;
        /** we already answered */
        checked: boolean | null;
        /** option disabled */
        disabled: boolean | null;
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

export type ModChoiceGetChoiceOptionsReturn = ModChoiceGetChoiceOptionsReturns;
export type mod_choice_get_choice_options_returns = ModChoiceGetChoiceOptionsReturns;
