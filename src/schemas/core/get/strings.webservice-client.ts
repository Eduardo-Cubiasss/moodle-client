/** Return some translated strings - like several core get_string(), calls */
export interface CoreGetStringsParams {
    strings: Array<{
        /** string identifier */
        stringid: string | null;
        /** component */
        component?: string | null;
        /** lang */
        lang?: string | null;
        /** the definition of a string param (i.e. {$a->name}) */
        stringparams?: Array<{
            /** param name - if the string expect only one $a parameter then don't send this field, just send the value. */
            name?: string | null;
            /** param value */
            value: string | null;
        }>;
    }>;
}

export type CoreGetStringsReturns = Array<{
    /** string id */
    stringid: string | null;
    /** string component */
    component: string | null;
    /** lang */
    lang: string | null;
    /** translated string */
    string: string | null;
}>;

export type CoreGetStringsReturn = CoreGetStringsReturns;
export type core_get_strings_returns = CoreGetStringsReturns;
