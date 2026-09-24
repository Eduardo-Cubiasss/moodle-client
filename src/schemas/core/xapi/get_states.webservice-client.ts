/** Get all state ID from an activityId. */
export interface CoreXapiGetStatesParams {
    /** Component name */
    component: string | null;
    /** xAPI activity ID IRI */
    activityId: string | null;
    /** The xAPI agent json */
    agent: string | null;
    /** The xAPI registration UUID */
    registration?: string | null;
    /** Filter ids stored since the timestamp (exclusive) */
    since?: string | null;
}

/** List of state Ids */
export type CoreXapiGetStatesReturns = string | null[];

export type CoreXapiGetStatesReturn = CoreXapiGetStatesReturns;
export type core_xapi_get_states_returns = CoreXapiGetStatesReturns;
