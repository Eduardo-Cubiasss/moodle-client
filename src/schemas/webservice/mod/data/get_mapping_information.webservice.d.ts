/** Get importing information */
export interface ModDataGetMappingInformationParams {
    /** Id of the data activity */
    cmid: number | null;
    /** Preset to be imported */
    importedpreset: string | null;
}

export interface ModDataGetMappingInformationReturns {
    /** Information to import if everything went fine */
    data?: {
        /** Whether the importing needs mapping or not */
        needsmapping: boolean | null;
        /** Name of the applied preset */
        presetname: string | null;
        /** List of field names to create */
        fieldstocreate: string | null;
        /** List of field names to remove */
        fieldstoremove: string | null;
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

export type ModDataGetMappingInformationReturn = ModDataGetMappingInformationReturns;
export type mod_data_get_mapping_information_returns = ModDataGetMappingInformationReturns;
