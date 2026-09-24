/** Set a users AI policy acceptance */
export interface CoreAiSetPolicyStatusParams {
    /** The context ID */
    contextid: number | null;
}

export interface CoreAiSetPolicyStatusReturns {
    /** Was the request successful */
    success: boolean | null;
}

export type CoreAiSetPolicyStatusReturn = CoreAiSetPolicyStatusReturns;
export type core_ai_set_policy_status_returns = CoreAiSetPolicyStatusReturns;
