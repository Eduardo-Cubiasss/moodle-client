/** Returns a list of recordings ready to import to be processed by a datatable. */
export interface ModBigbluebuttonbnGetRecordingsToImportParams {
    /** Id of the other BBB we target for importing recordings into. The idea here is to remove already imported recordings. */
    destinationinstanceid: number | null;
    /** bigbluebuttonbn instance id */
    sourcebigbluebuttonbnid?: number | null;
    /** source courseid to filter by */
    sourcecourseid?: number | null;
    /** a set of enabled tools */
    tools?: string | null;
    /** Group ID */
    groupid?: number | null;
}

export interface ModBigbluebuttonbnGetRecordingsToImportReturns {
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

export type ModBigbluebuttonbnGetRecordingsToImportReturn = ModBigbluebuttonbnGetRecordingsToImportReturns;
export type mod_bigbluebuttonbn_get_recordings_to_import_returns = ModBigbluebuttonbnGetRecordingsToImportReturns;
