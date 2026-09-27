/** Return a translated string - similar to core get_string(), call */
export interface CoreGetStringParams {
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
}

/** translated string */
export type CoreGetStringReturns = string | null;

export type CoreGetStringReturn = CoreGetStringReturns;
export type core_get_string_returns = CoreGetStringReturns;
