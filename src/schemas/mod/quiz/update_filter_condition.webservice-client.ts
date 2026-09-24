/** Update filter condition for a random question slot. */
export interface ModQuizUpdateFilterConditionParams {
    /** The cmid of the quiz */
    cmid: number | null;
    /** The quiz slot ID for the random question. */
    slotid: number | null;
    /** Filter condition */
    filtercondition: string | null;
}

export interface ModQuizUpdateFilterConditionReturns {
    /** Message */
    message?: string | null;
}

export type ModQuizUpdateFilterConditionReturn = ModQuizUpdateFilterConditionReturns;
export type mod_quiz_update_filter_condition_returns = ModQuizUpdateFilterConditionReturns;
