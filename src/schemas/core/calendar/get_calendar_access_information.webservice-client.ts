/** Convenience function to retrieve some permissions/access information for the given course calendar. */
export interface CoreCalendarGetCalendarAccessInformationParams {
    /** Course to check, empty for site calendar events. */
    courseid?: number | null;
}

export interface CoreCalendarGetCalendarAccessInformationReturns {
    /** Whether the user can manage entries. */
    canmanageentries: boolean | null;
    /** Whether the user can manage its own entries. */
    canmanageownentries: boolean | null;
    /** Whether the user can manage group entries. */
    canmanagegroupentries: boolean | null;
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

export type CoreCalendarGetCalendarAccessInformationReturn = CoreCalendarGetCalendarAccessInformationReturns;
export type core_calendar_get_calendar_access_information_returns = CoreCalendarGetCalendarAccessInformationReturns;
