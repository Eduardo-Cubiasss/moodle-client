/** Return the launch data for a given external tool. */
export interface ModLtiGetToolLaunchDataParams {
    /** external tool instance id */
    toolid: number | null;
}

export interface ModLtiGetToolLaunchDataReturns {
    /** Endpoint URL */
    endpoint: string | null;
    parameters: Array<{
        /** Parameter name */
        name: string | null;
        /** Parameter value */
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

export type ModLtiGetToolLaunchDataReturn = ModLtiGetToolLaunchDataReturns;
export type mod_lti_get_tool_launch_data_returns = ModLtiGetToolLaunchDataReturns;
