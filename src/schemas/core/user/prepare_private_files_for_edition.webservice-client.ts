/** Prepares the draft area for user private files. */
export interface CoreUserPreparePrivateFilesForEditionParams {}

export interface CoreUserPreparePrivateFilesForEditionReturns {
    /** Draft item id for the file area. */
    draftitemid: number | null;
    /** Draft file area options. */
    areaoptions: Array<{
        /** Name of option. */
        name: string | null;
        /** Value of option. */
        value: string | null;
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

export type CoreUserPreparePrivateFilesForEditionReturn = CoreUserPreparePrivateFilesForEditionReturns;
export type core_user_prepare_private_files_for_edition_returns = CoreUserPreparePrivateFilesForEditionReturns;
