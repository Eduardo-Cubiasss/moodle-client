/** Fetch the details of a policy version */
export interface ToolPolicyGetPolicyVersionParams {
    /** The policy version ID */
    versionid: number | null;
    /** The id of user on whose behalf the user is viewing the policy */
    behalfid?: number | null;
}

export interface ToolPolicyGetPolicyVersionReturns {
    result: {
        /** Policy information */
        policy?: {
            /** The policy version name */
            name?: string | null;
            /** The policy version id */
            versionid?: number | null;
            /** The policy version content */
            content?: string | null;
        };
    };
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

export type ToolPolicyGetPolicyVersionReturn = ToolPolicyGetPolicyVersionReturns;
export type tool_policy_get_policy_version_returns = ToolPolicyGetPolicyVersionReturns;
