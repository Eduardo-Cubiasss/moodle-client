/** Re-order condition within report */
export interface CoreReportbuilderConditionsReorderParams {
    /** Report ID */
    reportid: number | null;
    /** Condition ID */
    conditionid: number | null;
    /** New condition position */
    position: number | null;
}

export interface CoreReportbuilderConditionsReorderReturns {
    /** hasavailableconditions */
    hasavailableconditions: boolean;
    /** availableconditions */
    availableconditions: Array<{
        optiongroup: {
            /** text */
            text: string;
            /** values */
            values: Array<{
                /** value */
                value: string;
                /** visiblename */
                visiblename: string;
            }>;
        };
    }>;
    /** hasactiveconditions */
    hasactiveconditions: boolean;
    /** activeconditionsform */
    activeconditionsform: string;
    /** helpicon */
    helpicon: string;
    /** javascript */
    javascript?: string;
}

export type CoreReportbuilderConditionsReorderReturn = CoreReportbuilderConditionsReorderReturns;
export type core_reportbuilder_conditions_reorder_returns = CoreReportbuilderConditionsReorderReturns;
