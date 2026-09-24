/** Stores an action executed over a group of predictions. */
export interface ReportInsightsActionExecutedParams {
    /** The name of the action */
    actionname: string | null;
    /** Array of prediction ids */
    predictionids: number | null[];
}

export interface ReportInsightsActionExecutedReturns {
    /** list of warnings */
    warnings?: Array<{
        /** item */
        item?: string | null;
        /** item id */
        itemid?: number | null;
        /** the warning code can be used by the client app to implement specific behaviour */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type ReportInsightsActionExecutedReturn = ReportInsightsActionExecutedReturns;
export type report_insights_action_executed_returns = ReportInsightsActionExecutedReturns;
