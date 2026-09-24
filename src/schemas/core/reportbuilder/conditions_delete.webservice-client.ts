/** Delete condition from report */
export interface CoreReportbuilderConditionsDeleteParams {
    /** Report ID */
    reportid: number | null;
    /** Condition ID */
    conditionid: number | null;
}

export interface CoreReportbuilderConditionsDeleteReturns {
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

export type CoreReportbuilderConditionsDeleteReturn = CoreReportbuilderConditionsDeleteReturns;
export type core_reportbuilder_conditions_delete_returns = CoreReportbuilderConditionsDeleteReturns;
