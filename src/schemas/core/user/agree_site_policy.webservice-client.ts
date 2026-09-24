/** Agree the site policy for the current user. */
export interface CoreUserAgreeSitePolicyParams {}

export interface CoreUserAgreeSitePolicyReturns {
    /** Status: true only if we set the policyagreed to 1 for the user */
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

export type CoreUserAgreeSitePolicyReturn = CoreUserAgreeSitePolicyReturns;
export type core_user_agree_site_policy_returns = CoreUserAgreeSitePolicyReturns;
