/** Returns the filters available in the given contexts. */
export interface CoreFiltersGetAvailableInContextParams {
    /** The list of contexts to check. */
    contexts: Array<{
        /** The context level where the filters are: (coursecat, course, module) */
        contextlevel: string | null;
        /** The instance id of item associated with the context. */
        instanceid: number | null;
    }>;
}

export interface CoreFiltersGetAvailableInContextReturns {
    /** Available filters */
    filters: Array<{
        /** The context level where the filters are: (coursecat, course, module). */
        contextlevel: string | null;
        /** The instance id of item associated with the context. */
        instanceid: number | null;
        /** The context id. */
        contextid: number | null;
        /** Filter plugin name. */
        filter: string | null;
        /** Filter state: 1 for on, -1 for off, 0 if inherit. */
        localstate: number | null;
        /** 1 or 0 to use when localstate is set to inherit. */
        inheritedstate: number | null;
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

export type CoreFiltersGetAvailableInContextReturn = CoreFiltersGetAvailableInContextReturns;
export type core_filters_get_available_in_context_returns = CoreFiltersGetAvailableInContextReturns;
