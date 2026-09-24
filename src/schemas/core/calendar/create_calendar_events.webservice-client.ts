/** Create calendar events */
export interface CoreCalendarCreateCalendarEventsParams {
    events: Array<{
        /** event name */
        name: string;
        /** Description */
        description?: string | null;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        format?: number | null;
        /** course id */
        courseid?: number;
        /** group id */
        groupid?: number;
        /** number of repeats */
        repeats?: number;
        /** Event type */
        eventtype?: string;
        /** timestart */
        timestart?: number;
        /** time duration */
        timeduration?: number;
        /** visible */
        visible?: number;
        /** sequence */
        sequence?: number;
    }>;
}

export interface CoreCalendarCreateCalendarEventsReturns {
    events: Array<{
        /** event id */
        id: number | null;
        /** event name */
        name: string | null;
        /** Description */
        description?: string | null;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        format: number | null;
        /** course id */
        courseid: number | null;
        /** group id */
        groupid: number | null;
        /** user id */
        userid: number | null;
        /** repeat id */
        repeatid?: number | null;
        /** module name */
        modulename?: string | null;
        /** instance id */
        instance: number | null;
        /** Event type */
        eventtype: string | null;
        /** timestart */
        timestart: number | null;
        /** time duration */
        timeduration: number | null;
        /** visible */
        visible: number | null;
        /** unique id of ical events */
        uuid?: string;
        /** sequence */
        sequence: number | null;
        /** time modified */
        timemodified: number | null;
        /** Subscription id */
        subscriptionid?: number | null;
    }>;
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

export type CoreCalendarCreateCalendarEventsReturn = CoreCalendarCreateCalendarEventsReturns;
export type core_calendar_create_calendar_events_returns = CoreCalendarCreateCalendarEventsReturns;
