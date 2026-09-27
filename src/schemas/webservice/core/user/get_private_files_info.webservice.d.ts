/** Returns general information about files in the user private files area. */
export interface CoreUserGetPrivateFilesInfoParams {
    /** Id of the user, default to current user. */
    userid?: number | null;
}

export interface CoreUserGetPrivateFilesInfoReturns {
    /** Number of files in the area. */
    filecount: number | null;
    /** Number of folders in the area. */
    foldercount: number | null;
    /** Total size of the files in the area. */
    filesize: number | null;
    /** Total size of the area excluding file references */
    filesizewithoutreferences: number | null;
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

export type CoreUserGetPrivateFilesInfoReturn = CoreUserGetPrivateFilesInfoReturns;
export type core_user_get_private_files_info_returns = CoreUserGetPrivateFilesInfoReturns;
