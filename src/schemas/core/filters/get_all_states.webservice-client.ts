/** Retrieve all the filters and their states (including overridden ones in any context). */
export interface CoreFiltersGetAllStatesParams {}

export interface CoreFiltersGetAllStatesReturns {
    /** All filters states */
    filters: Array<{
        /** The context level where the filters are: (coursecat, course, module). */
        contextlevel: string | null;
        /** The instance id of item associated with the context. */
        instanceid: number | null;
        /** The context id. */
        contextid: number | null;
        /** Filter plugin name. */
        filter: string | null;
        /** Filter state: 1 for on, -1 for off, -9999 if disabled. */
        state: number | null;
        /** Execution order. */
        sortorder: number | null;
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

export type CoreFiltersGetAllStatesReturn = CoreFiltersGetAllStatesReturns;
export type core_filters_get_all_states_returns = CoreFiltersGetAllStatesReturns;
