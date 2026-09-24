/** Copy files from a draft area to users private files area. */
export interface CoreUserUpdatePrivateFilesParams {
    /** The draft item id with the files. */
    draftitemid: number | null;
}

export interface CoreUserUpdatePrivateFilesReturns {
    /** The update result, true if everything went well. */
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

export type CoreUserUpdatePrivateFilesReturn = CoreUserUpdatePrivateFilesReturns;
export type core_user_update_private_files_returns = CoreUserUpdatePrivateFilesReturns;
