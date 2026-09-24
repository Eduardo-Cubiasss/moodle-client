/** Updates an existing entry. */
export interface ModDataUpdateEntryParams {
    /** The entry record id. */
    entryid: number | null;
    /** The fields data to be updated */
    data: Array<{
        /** The field id. */
        fieldid: number | null;
        /** The subfield name (if required). */
        subfield?: string | null;
        /** The new contents for the field always JSON encoded. */
        value: string | null;
    }>;
}

export interface ModDataUpdateEntryReturns {
    /** True if the entry was successfully updated, false other wise. */
    updated: boolean | null;
    generalnotifications: string | null[];
    fieldnotifications: Array<{
        /** The field name. */
        fieldname: string | null;
        /** The notification for the field. */
        notification: string | null;
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

export type ModDataUpdateEntryReturn = ModDataUpdateEntryReturns;
export type mod_data_update_entry_returns = ModDataUpdateEntryReturns;
