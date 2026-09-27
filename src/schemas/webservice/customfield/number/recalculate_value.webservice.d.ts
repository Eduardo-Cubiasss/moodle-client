/** This web service is used to recalculate the value of automatically populated number custom field. */
export interface CustomfieldNumberRecalculateValueParams {
    /** Field id */
    fieldid: number | null;
    /** Instance id */
    instanceid: number | null;
}

export interface CustomfieldNumberRecalculateValueReturns {
    /** Recalculated value (prepared for display) */
    value: string | null;
}

export type CustomfieldNumberRecalculateValueReturn = CustomfieldNumberRecalculateValueReturns;
export type customfield_number_recalculate_value_returns = CustomfieldNumberRecalculateValueReturns;
