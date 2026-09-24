/** Trigger the course module viewed event. */
export interface ModScormViewScormParams {
    /** scorm instance id */
    scormid: number | null;
}

export interface ModScormViewScormReturns {
    /** status: true if success */
    status: boolean | null;
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

export type ModScormViewScormReturn = ModScormViewScormReturns;
export type mod_scorm_view_scorm_returns = ModScormViewScormReturns;
