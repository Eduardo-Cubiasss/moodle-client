/** Simulate the view.php web interface data: trigger events, completion, etc... */
export interface ModDataViewDatabaseParams {
    /** data instance id */
    databaseid: number | null;
}

export interface ModDataViewDatabaseReturns {
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

export type ModDataViewDatabaseReturn = ModDataViewDatabaseReturns;
export type mod_data_view_database_returns = ModDataViewDatabaseReturns;
