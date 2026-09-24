/** Retrieve the list of potential contexts for a model. */
export interface ToolAnalyticsPotentialContextsParams {
    /** The model id */
    query?: string | null;
    /** The model id */
    modelid?: number | null;
}

export type ToolAnalyticsPotentialContextsReturns = Array<{
    /** ID of the context */
    id: number | null;
    /** The context name */
    name: string | null;
}>;

export type ToolAnalyticsPotentialContextsReturn = ToolAnalyticsPotentialContextsReturns;
export type tool_analytics_potential_contexts_returns = ToolAnalyticsPotentialContextsReturns;
