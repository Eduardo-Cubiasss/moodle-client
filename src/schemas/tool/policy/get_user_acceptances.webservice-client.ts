/** Get user policies acceptances. */
export interface ToolPolicyGetUserAcceptancesParams {
    /** The user id we want to retrieve the acceptances. */
    userid?: number | null;
}

export interface ToolPolicyGetUserAcceptancesReturns {
    /** Policies and acceptance status for the given user. */
    policies?: Array<{
        /** The policy id. */
        policyid: number | null;
        /** The policy version id. */
        versionid: number | null;
        /** The policy agreement style. 0: consent page, 1: own page. */
        agreementstyle: number | null;
        /** Whether the policy is optional. 0: compulsory, 1: optional */
        optional: number | null;
        /** The policy revision. */
        revision: string | null;
        /** The policy status. 0: draft, 1: active, 2: archived. */
        status: number | null;
        /** The policy name */
        name: string | null;
        /** The policy summary. */
        summary?: string | null;
        /** summary format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        summaryformat: number | null;
        /** The policy content. */
        content?: string | null;
        /** content format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        contentformat: number | null;
        /** Acceptance status for the given user. */
        acceptance?: {
            /** The acceptance status. 0: declined, 1: accepted. */
            status: number | null;
            /** The policy lang. */
            lang: string | null;
            /** The time the acceptance was set. */
            timemodified: number | null;
            /** The user who accepted. */
            usermodified: number | null;
            /** The policy note/remarks. */
            note?: string | null;
            /** The fullname who accepted on behalf. */
            modfullname?: string | null;
        };
        /** Whether the policy can be accepted. */
        canaccept: boolean | null;
        /** Whether the policy can be declined. */
        candecline: boolean | null;
        /** Whether the policy can be revoked. */
        canrevoke: boolean | null;
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

export type ToolPolicyGetUserAcceptancesReturn = ToolPolicyGetUserAcceptancesReturns;
export type tool_policy_get_user_acceptances_returns = ToolPolicyGetUserAcceptancesReturns;
