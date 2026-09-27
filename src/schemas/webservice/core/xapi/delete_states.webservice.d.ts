/** Delete all xAPI state data from an activityId. */
export interface CoreXapiDeleteStatesParams {
    /** Component name */
    component: string | null;
    /** xAPI activity ID IRI */
    activityId: string | null;
    /** The xAPI agent json */
    agent: string | null;
    /** The xAPI registration UUID */
    registration?: string | null;
}

export type CoreXapiDeleteStatesReturns = unknown;

export type CoreXapiDeleteStatesReturn = CoreXapiDeleteStatesReturns;
export type core_xapi_delete_states_returns = CoreXapiDeleteStatesReturns;
