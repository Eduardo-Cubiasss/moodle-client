/** Returns a list of the site configurations, filtering by section. */
export interface ToolMobileGetConfigParams {
    /** Settings section name. */
    section?: string | null;
}

export interface ToolMobileGetConfigReturns {
    /** Settings */
    settings: Array<{
        /** The name of the setting */
        name: string | null;
        /** The value of the setting */
        value: string | null;
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

export type ToolMobileGetConfigReturn = ToolMobileGetConfigReturns;
export type tool_mobile_get_config_returns = ToolMobileGetConfigReturns;
