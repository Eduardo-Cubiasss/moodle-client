/** Get the type of events a user can create in the given course. */
export interface CoreCalendarGetAllowedEventTypesParams {
    /** Course to check, empty for site. */
    courseid?: number | null;
}

export interface CoreCalendarGetAllowedEventTypesReturns {
    allowedeventtypes: string | null[];
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

export type CoreCalendarGetAllowedEventTypesReturn = CoreCalendarGetAllowedEventTypesReturns;
export type core_calendar_get_allowed_event_types_returns = CoreCalendarGetAllowedEventTypesReturns;
