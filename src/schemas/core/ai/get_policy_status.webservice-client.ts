/** Get a users AI policy acceptance */
export interface CoreAiGetPolicyStatusParams {
    /** The user ID */
    userid: number | null;
}

export interface CoreAiGetPolicyStatusReturns {
    /** True if the policy was accepted, false otherwise. */
    status: boolean | null;
}

export type CoreAiGetPolicyStatusReturn = CoreAiGetPolicyStatusReturns;
export type core_ai_get_policy_status_returns = CoreAiGetPolicyStatusReturns;
