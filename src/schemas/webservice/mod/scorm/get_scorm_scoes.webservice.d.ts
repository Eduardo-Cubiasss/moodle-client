/** Returns a list containing all the scoes data related to the given scorm id */
export interface ModScormGetScormScoesParams {
    /** scorm instance id */
    scormid: number | null;
    /** organization id */
    organization?: string | null;
}

export interface ModScormGetScormScoesReturns {
    scoes: Array<{
        /** sco id */
        id: number | null;
        /** scorm id */
        scorm: number | null;
        /** manifest id */
        manifest: string | null;
        /** organization id */
        organization: string | null;
        /** parent */
        parent: string | null;
        /** identifier */
        identifier: string | null;
        /** launch file */
        launch: string | null;
        /** scorm type (asset, sco) */
        scormtype: string | null;
        /** sco title */
        title: string | null;
        /** sort order */
        sortorder: number | null;
        /** Additional SCO data */
        extradata?: Array<{
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

export type ModScormGetScormScoesReturn = ModScormGetScormScoesReturns;
export type mod_scorm_get_scorm_scoes_returns = ModScormGetScormScoesReturns;
