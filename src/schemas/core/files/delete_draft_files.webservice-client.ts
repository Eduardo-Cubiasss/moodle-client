/** Delete the indicated files (or directories) from a user draft file area. */
export interface CoreFilesDeleteDraftFilesParams {
    /** Item id of the draft file area */
    draftitemid: number | null;
    /** Files or directories to be deleted. */
    files: Array<{
        /** Path to the file or directory to delete. */
        filepath: string | null;
        /** Name of the file to delete. */
        filename: string | null;
    }>;
}

export interface CoreFilesDeleteDraftFilesReturns {
    parentpaths: string | null[];
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

export type CoreFilesDeleteDraftFilesReturn = CoreFilesDeleteDraftFilesReturns;
export type core_files_delete_draft_files_returns = CoreFilesDeleteDraftFilesReturns;
