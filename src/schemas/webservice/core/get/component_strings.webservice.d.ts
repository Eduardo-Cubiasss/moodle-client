export interface CoreGetComponentStringsParams {
    /** component */
    component: string | null;
    /** lang */
    lang?: string | null;
}

export type CoreGetComponentStringsReturns = Array<{
    /** string id */
    stringid: string | null;
    /** translated string */
    string: string | null;
}>;

export type CoreGetComponentStringsReturn = CoreGetComponentStringsReturns;
export type core_get_component_strings_returns = CoreGetComponentStringsReturns;
