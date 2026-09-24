/** Returns a list of recordings ready to be processed by a datatable. */
export interface ModBigbluebuttonbnGetRecordingsParams {
    /** bigbluebuttonbn instance id */
    bigbluebuttonbnid: number | null;
    /** a set of enabled tools */
    tools?: string | null;
    /** Group ID */
    groupid?: number | null;
}

export interface ModBigbluebuttonbnGetRecordingsReturns {
    /** Whether the fetch was successful */
    status: boolean | null;
    tabledata?: {
        activity: string | null;
        ping_interval: number | null;
        locale: string | null;
        profile_features: string | null[];
        columns: Array<{
            key: string | null;
            label: string | null;
            width: string | null;
            /** Column type */
            type?: string | null;
            /** Whether this column is sortable */
            sortable?: boolean | null;
            /** Whether this column contains HTML */
            allowHTML?: boolean | null;
            /** Formatter name */
            formatter?: string | null;
        }>;
        data: string | null;
    };
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

export type ModBigbluebuttonbnGetRecordingsReturn = ModBigbluebuttonbnGetRecordingsReturns;
export type mod_bigbluebuttonbn_get_recordings_returns = ModBigbluebuttonbnGetRecordingsReturns;
