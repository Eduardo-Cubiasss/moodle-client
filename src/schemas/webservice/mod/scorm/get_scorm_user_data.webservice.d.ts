/** Retrieves user tracking and SCO data and default SCORM values */
export interface ModScormGetScormUserDataParams {
    /** scorm instance id */
    scormid: number | null;
    /** attempt number */
    attempt: number | null;
}

export interface ModScormGetScormUserDataReturns {
    data: Array<{
        /** sco id */
        scoid: number | null;
        userdata: Array<{
            /** element name */
            element: string | null;
            /** element value */
            value: string | null;
        }>;
        defaultdata: Array<{
            /** element name */
            element: string | null;
            /** element value */
            value: string | null;
        }>;
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

export type ModScormGetScormUserDataReturn = ModScormGetScormUserDataReturns;
export type mod_scorm_get_scorm_user_data_returns = ModScormGetScormUserDataReturns;
