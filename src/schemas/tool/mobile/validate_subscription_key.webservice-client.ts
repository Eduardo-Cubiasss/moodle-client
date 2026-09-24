/** Check if the given site subscription key is valid. */
export interface ToolMobileValidateSubscriptionKeyParams {
    /** Site subscription temporary key. */
    key: string | null;
}

export interface ToolMobileValidateSubscriptionKeyReturns {
    /** Whether the key is validated or not. */
    validated: boolean | null;
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

export type ToolMobileValidateSubscriptionKeyReturn = ToolMobileValidateSubscriptionKeyReturns;
export type tool_mobile_validate_subscription_key_returns = ToolMobileValidateSubscriptionKeyReturns;
