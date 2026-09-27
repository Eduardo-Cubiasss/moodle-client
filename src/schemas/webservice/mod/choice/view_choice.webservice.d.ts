/** Trigger the course module viewed event and update the module completion status. */
export interface ModChoiceViewChoiceParams {
    /** choice instance id */
    choiceid: number | null;
}

export interface ModChoiceViewChoiceReturns {
    /** status: true if success */
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

export type ModChoiceViewChoiceReturn = ModChoiceViewChoiceReturns;
export type mod_choice_view_choice_returns = ModChoiceViewChoiceReturns;
