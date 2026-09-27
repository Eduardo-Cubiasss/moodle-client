/** Call multiple external functions and return all responses. */
export interface ToolMobileCallExternalFunctionsParams {
    requests: Array<{
        /** Function name */
        function: string | null;
        /** JSON-encoded object with named arguments */
        arguments?: string | null;
        /** Return raw text */
        settingraw?: boolean | null;
        /** Filter text */
        settingfilter?: boolean | null;
        /** Rewrite plugin file URLs */
        settingfileurl?: boolean | null;
        /** Session language */
        settinglang?: string | null;
    }>;
}

export interface ToolMobileCallExternalFunctionsReturns {
    responses: Array<{
        /** Whether an exception was thrown. */
        error: boolean | null;
        /** JSON-encoded response data */
        data?: string | null;
        /** JSON-encoed exception info */
        exception?: string | null;
    }>;
}

export type ToolMobileCallExternalFunctionsReturn = ToolMobileCallExternalFunctionsReturns;
export type tool_mobile_call_external_functions_returns = ToolMobileCallExternalFunctionsReturns;
