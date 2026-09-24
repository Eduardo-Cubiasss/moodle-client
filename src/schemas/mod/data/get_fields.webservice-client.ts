/** Return the list of configured fields for the given database. */
export interface ModDataGetFieldsParams {
    /** Database instance id. */
    databaseid: number | null;
}

export interface ModDataGetFieldsReturns {
    fields: Array<{
        /** Field id. */
        id: number;
        /** The field type of the content. */
        dataid: number;
        /** The field type. */
        type: string;
        /** The field name. */
        name: string;
        /** The field description. */
        description: string;
        /** Whether is a field required or not. */
        required: boolean;
        /** Field parameters */
        param1: string | null;
        /** Field parameters */
        param2: string | null;
        /** Field parameters */
        param3: string | null;
        /** Field parameters */
        param4: string | null;
        /** Field parameters */
        param5: string | null;
        /** Field parameters */
        param6: string | null;
        /** Field parameters */
        param7: string | null;
        /** Field parameters */
        param8: string | null;
        /** Field parameters */
        param9: string | null;
        /** Field parameters */
        param10: string | null;
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

export type ModDataGetFieldsReturn = ModDataGetFieldsReturns;
export type mod_data_get_fields_returns = ModDataGetFieldsReturns;
