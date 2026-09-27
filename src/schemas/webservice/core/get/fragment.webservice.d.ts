/** Return a fragment for inclusion, such as a JavaScript page. */
export interface CoreGetFragmentParams {
    /** Component for the callback e.g. mod_assign */
    component: string | null;
    /** Name of the callback to execute */
    callback: string | null;
    /** Context ID that the fragment is from */
    contextid: number | null;
    /** args for the callback are optional */
    args?: Array<{
        /** param name */
        name: string | null;
        /** param value */
        value: string | null;
    }>;
}

export interface CoreGetFragmentReturns {
    /** HTML fragment. */
    html: string | null;
    /** JavaScript fragment */
    javascript: string | null;
}

export type CoreGetFragmentReturn = CoreGetFragmentReturns;
export type core_get_fragment_returns = CoreGetFragmentReturns;
