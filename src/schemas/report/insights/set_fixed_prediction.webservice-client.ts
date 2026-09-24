/** Flags a prediction as fixed. */
export interface ReportInsightsSetFixedPredictionParams {
    /** The prediction id */
    predictionid: number | null;
}

export interface ReportInsightsSetFixedPredictionReturns {
    /** True if the prediction was successfully flagged as fixed. */
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

export type ReportInsightsSetFixedPredictionReturn = ReportInsightsSetFixedPredictionReturns;
export type report_insights_set_fixed_prediction_returns = ReportInsightsSetFixedPredictionReturns;
