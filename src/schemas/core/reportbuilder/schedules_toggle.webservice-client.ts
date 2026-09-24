/** Toggle state of report schedule */
export interface CoreReportbuilderSchedulesToggleParams {
    /** Report ID */
    reportid: number | null;
    /** Schedule ID */
    scheduleid: number | null;
    /** Schedule enabled */
    enabled: boolean | null;
}

export type CoreReportbuilderSchedulesToggleReturns = boolean | null;

export type CoreReportbuilderSchedulesToggleReturn = CoreReportbuilderSchedulesToggleReturns;
export type core_reportbuilder_schedules_toggle_returns = CoreReportbuilderSchedulesToggleReturns;
