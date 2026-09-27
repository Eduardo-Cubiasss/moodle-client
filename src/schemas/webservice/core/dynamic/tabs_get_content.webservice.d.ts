/** Returns the content for a dynamic tab */
export interface CoreDynamicTabsGetContentParams {
    /** Tab class */
    tab: string | null;
    /** Json-encoded data */
    jsondata: string | null;
}

export interface CoreDynamicTabsGetContentReturns {
    /** Template name */
    template: string | null;
    /** JSON-encoded data for template */
    content: string | null;
    /** JavaScript fragment */
    javascript: string | null;
}

export type CoreDynamicTabsGetContentReturn = CoreDynamicTabsGetContentReturns;
export type core_dynamic_tabs_get_content_returns = CoreDynamicTabsGetContentReturns;
