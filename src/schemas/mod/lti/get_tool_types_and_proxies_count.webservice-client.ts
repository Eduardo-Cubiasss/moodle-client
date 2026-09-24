/** Get total number of the tool types and tool proxies */
export interface ModLtiGetToolTypesAndProxiesCountParams {
    /** Tool proxy id */
    toolproxyid?: number | null;
    /** Orphaned tool types only */
    orphanedonly?: boolean | null;
}

export interface ModLtiGetToolTypesAndProxiesCountReturns {
    /** Total number of tool types and proxies */
    count: number | null;
}

export type ModLtiGetToolTypesAndProxiesCountReturn = ModLtiGetToolTypesAndProxiesCountReturns;
export type mod_lti_get_tool_types_and_proxies_count_returns = ModLtiGetToolTypesAndProxiesCountReturns;
