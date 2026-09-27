/** Fetch unix timestamps for given date times. */
export interface CoreCalendarGetTimestampsParams {
    data: Array<{
        /** key */
        key?: string | null;
        /** year */
        year: number | null;
        /** month */
        month: number | null;
        /** day */
        day: number | null;
        /** hour */
        hour?: number | null;
        /** minute */
        minute?: number | null;
    }>;
}

export interface CoreCalendarGetTimestampsReturns {
    timestamps: Array<{
        /** Timestamp key */
        key: string | null;
        /** Unix timestamp */
        timestamp: number | null;
    }>;
}

export type CoreCalendarGetTimestampsReturn = CoreCalendarGetTimestampsReturns;
export type core_calendar_get_timestamps_returns = CoreCalendarGetTimestampsReturns;
