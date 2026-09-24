/** Set the acceptance status (accept or decline only) for the indicated policies for the given user. */
export interface ToolPolicySetAcceptancesStatusParams {
    /** Policies acceptances for the given user. */
    policies: Array<{
        /** The policy version id. */
        versionid: number | null;
        /** The policy acceptance status. 0: decline, 1: accept. */
        status: number | null;
        /** Any comments added by a user when giving consent on behalf of another user. */
        note?: string | null;
    }>;
    /** The user id we want to set the acceptances. Default is the current user. */
    userid?: number | null;
}

export interface ToolPolicySetAcceptancesStatusReturns {
    /** Whether the user has provided acceptance to all current site policies. 1 if yes, 0 if not */
    policyagreed: number | null;
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

export type ToolPolicySetAcceptancesStatusReturn = ToolPolicySetAcceptancesStatusReturns;
export type tool_policy_set_acceptances_status_returns = ToolPolicySetAcceptancesStatusReturns;
