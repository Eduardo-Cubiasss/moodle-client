/** Generate a new draft itemid for the current user. */
export interface CoreFilesGetUnusedDraftItemidParams {}

export interface CoreFilesGetUnusedDraftItemidReturns {
    /** File area component. */
    component: string | null;
    /** File area context. */
    contextid: number | null;
    /** File area user id. */
    userid: number | null;
    /** File area name. */
    filearea: string | null;
    /** File are item id. */
    itemid: number | null;
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

export type CoreFilesGetUnusedDraftItemidReturn = CoreFilesGetUnusedDraftItemidReturns;
export type core_files_get_unused_draft_itemid_returns = CoreFilesGetUnusedDraftItemidReturns;
