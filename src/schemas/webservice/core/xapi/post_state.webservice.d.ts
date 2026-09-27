/** Post an xAPI state into an activityId. */
export interface CoreXapiPostStateParams {
    /** Component name */
    component: string | null;
    /** xAPI activity ID IRI */
    activityId: string | null;
    /** The xAPI agent json */
    agent: string | null;
    /** The xAPI state ID */
    stateId: string | null;
    /** JSON object with the state data */
    stateData: string | null;
    /** The xAPI registration UUID */
    registration?: string | null;
}

/** If the state is accepted */
export type CoreXapiPostStateReturns = boolean | null;

export type CoreXapiPostStateReturn = CoreXapiPostStateReturns;
export type core_xapi_post_state_returns = CoreXapiPostStateReturns;
