/** Delete site user preset. */
export interface ModDataDeleteSavedPresetParams {
    /** Id of the data activity */
    dataid: number | null;
    presetnames: string | null[];
}

export interface ModDataDeleteSavedPresetReturns {
    /** The processing result */
    result: boolean | null;
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

export type ModDataDeleteSavedPresetReturn = ModDataDeleteSavedPresetReturns;
export type mod_data_delete_saved_preset_returns = ModDataDeleteSavedPresetReturns;
