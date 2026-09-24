/** End a meeting */
export interface ModBigbluebuttonbnEndMeetingParams {
    /** bigbluebuttonbn instance id */
    bigbluebuttonbnid: number | null;
    /** bigbluebuttonbn group id */
    groupid?: number | null;
}

export interface ModBigbluebuttonbnEndMeetingReturns {
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

export type ModBigbluebuttonbnEndMeetingReturn = ModBigbluebuttonbnEndMeetingReturns;
export type mod_bigbluebuttonbn_end_meeting_returns = ModBigbluebuttonbnEndMeetingReturns;
