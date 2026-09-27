/** Simulate the view.php web interface folder: trigger events, completion, etc... */
export interface ModFolderViewFolderParams {
    /** folder instance id */
    folderid: number | null;
}

export interface ModFolderViewFolderReturns {
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

export type ModFolderViewFolderReturn = ModFolderViewFolderReturns;
export type mod_folder_view_folder_returns = ModFolderViewFolderReturns;
