/** Updates the default category and purpose for a given context level (and optionally, a plugin) */
export interface ToolDataprivacySetContextDefaultsParams {
    /** The context level */
    contextlevel: number | null;
    /** The default category for the given context level */
    category: number | null;
    /** The default purpose for the given context level */
    purpose: number | null;
    /** The plugin name of the activity */
    activity?: string | null;
    /** Whether to override existing instances with the defaults */
    override?: boolean | null;
}

export interface ToolDataprivacySetContextDefaultsReturns {
    /** Whether the context defaults were successfully set or not */
    result: boolean | null;
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

export type ToolDataprivacySetContextDefaultsReturn = ToolDataprivacySetContextDefaultsReturns;
export type tool_dataprivacy_set_context_defaults_returns = ToolDataprivacySetContextDefaultsReturns;
