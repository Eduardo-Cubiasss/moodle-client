/** Return the auth token required for exporting a calendar. */
export interface CoreCalendarGetCalendarExportTokenParams {}

export interface CoreCalendarGetCalendarExportTokenReturns {
    /** The calendar permanent access token for calendar export. */
    token: string | null;
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

export type CoreCalendarGetCalendarExportTokenReturn = CoreCalendarGetCalendarExportTokenReturns;
export type core_calendar_get_calendar_export_token_returns = CoreCalendarGetCalendarExportTokenReturns;
