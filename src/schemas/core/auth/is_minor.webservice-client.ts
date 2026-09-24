/** Requests a check if a user is a digital minor. */
export interface CoreAuthIsMinorParams {
    /** Age */
    age: number | null;
    /** Country of residence */
    country: string | null;
}

export interface CoreAuthIsMinorReturns {
    /** True if the user is considered to be a digital minor, false if not */
    status: boolean | null;
}

export type CoreAuthIsMinorReturn = CoreAuthIsMinorReturns;
export type core_auth_is_minor_returns = CoreAuthIsMinorReturns;
