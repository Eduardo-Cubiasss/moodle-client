/** Get an xAPI state data from an activityId. */
export interface CoreXapiGetStateParams {
    /** Component name */
    component: string | null;
    /** xAPI activity ID IRI */
    activityId: string | null;
    /** The xAPI agent json */
    agent: string | null;
    /** The xAPI state ID */
    stateId: string | null;
    /** The xAPI registration UUID */
    registration?: string | null;
}

/** The state data json */
export type CoreXapiGetStateReturns = string | null;

export type CoreXapiGetStateReturn = CoreXapiGetStateReturns;
export type core_xapi_get_state_returns = CoreXapiGetStateReturns;
