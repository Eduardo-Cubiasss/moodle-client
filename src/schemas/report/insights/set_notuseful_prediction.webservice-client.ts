/** Flags the prediction as not useful. */
export interface ReportInsightsSetNotusefulPredictionParams {
    /** The prediction id */
    predictionid: number | null;
}

export interface ReportInsightsSetNotusefulPredictionReturns {
    /** True if the prediction was successfully flagged as not useful. */
    success: boolean | null;
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

export type ReportInsightsSetNotusefulPredictionReturn = ReportInsightsSetNotusefulPredictionReturns;
export type report_insights_set_notuseful_prediction_returns = ReportInsightsSetNotusefulPredictionReturns;
