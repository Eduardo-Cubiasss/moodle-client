/** Fetches a list of activity options */
export interface ToolDataprivacyGetActivityOptionsParams {
    /** Whether to fetch all activities or only those without defaults */
    nodefaults?: boolean | null;
}

export interface ToolDataprivacyGetActivityOptionsReturns {
    options: Array<{
        /** The plugin name of the activity */
        name: string | null;
        /** The display name of the activity */
        displayname: string | null;
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

export type ToolDataprivacyGetActivityOptionsReturn = ToolDataprivacyGetActivityOptionsReturns;
export type tool_dataprivacy_get_activity_options_returns = ToolDataprivacyGetActivityOptionsReturns;
