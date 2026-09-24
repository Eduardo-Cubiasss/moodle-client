/** Add condition to report */
export interface CoreReportbuilderConditionsAddParams {
    /** Report ID */
    reportid: number | null;
    /** Unique identifier of the condition */
    uniqueidentifier: string | null;
}

export interface CoreReportbuilderConditionsAddReturns {
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

export type CoreReportbuilderConditionsAddReturn = CoreReportbuilderConditionsAddReturns;
export type core_reportbuilder_conditions_add_returns = CoreReportbuilderConditionsAddReturns;
