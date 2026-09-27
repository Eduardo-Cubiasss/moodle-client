/** Delete an xAPI state data from an activityId. */
export interface CoreXapiDeleteStateParams {
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

/** If the state data is deleted */
export type CoreXapiDeleteStateReturns = boolean | null;

export type CoreXapiDeleteStateReturn = CoreXapiDeleteStateReturns;
export type core_xapi_delete_state_returns = CoreXapiDeleteStateReturns;
