/** Delete calendar events */
export interface CoreCalendarDeleteCalendarEventsParams {
    events: Array<{
        /** Event ID */
        eventid: number;
        /** Delete comeplete series if repeated event */
        repeat: boolean | null;
    }>;
}

export type CoreCalendarDeleteCalendarEventsReturns = unknown;

export type CoreCalendarDeleteCalendarEventsReturn = CoreCalendarDeleteCalendarEventsReturns;
export type core_calendar_delete_calendar_events_returns = CoreCalendarDeleteCalendarEventsReturns;
