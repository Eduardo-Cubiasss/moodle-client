/** Reset conditions for given report */
export interface CoreReportbuilderConditionsResetParams {
    /** Report ID */
    reportid: number | null;
}

export interface CoreReportbuilderConditionsResetReturns {
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

export type CoreReportbuilderConditionsResetReturn = CoreReportbuilderConditionsResetReturns;
export type core_reportbuilder_conditions_reset_returns = CoreReportbuilderConditionsResetReturns;
