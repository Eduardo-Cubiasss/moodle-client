/** Retrieves SCO tracking data for the given user id and attempt number */
export interface ModScormGetScormScoTracksParams {
    /** sco id */
    scoid: number | null;
    /** user id */
    userid: number | null;
    /** attempt number (0 for last attempt) */
    attempt?: number | null;
}

export interface ModScormGetScormScoTracksReturns {
    /** SCO data */
    data: {
        /** Attempt number */
        attempt: number | null;
        tracks: Array<{
            /** Element name */
            element: string | null;
            /** Element value */
            value: string | null;
        }>;
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

export type ModScormGetScormScoTracksReturn = ModScormGetScormScoTracksReturns;
export type mod_scorm_get_scorm_sco_tracks_returns = ModScormGetScormScoTracksReturns;
