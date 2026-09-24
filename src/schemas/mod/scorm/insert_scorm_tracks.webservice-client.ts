/** Saves a scorm tracking record. It will overwrite any existing tracking data for this attempt. Validation should be performed before running the function to ensure the user will not lose any existing attempt data. */
export interface ModScormInsertScormTracksParams {
    /** SCO id */
    scoid: number | null;
    /** attempt number */
    attempt: number | null;
    tracks: Array<{
        /** element name */
        element: string | null;
        /** element value */
        value: string | null;
    }>;
}

export interface ModScormInsertScormTracksReturns {
    trackids: number | null[];
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

export type ModScormInsertScormTracksReturn = ModScormInsertScormTracksReturns;
export type mod_scorm_insert_scorm_tracks_returns = ModScormInsertScormTracksReturns;
