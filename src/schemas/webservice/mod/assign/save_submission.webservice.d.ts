/** Update the current students submission */
export interface ModAssignSaveSubmissionParams {
    /** The assignment id to operate on */
    assignmentid: number | null;
    plugindata: {
        /** The id of a draft area containing files for this submission. */
        files_filemanager?: number | null;
        /** Editor structure */
        onlinetext_editor?: {
            /** The text for this submission. */
            text: string | null;
            /** The format for this submission */
            format: number | null;
            /** The draft area id for files attached to the submission */
            itemid: number | null;
        };
    };
}

/** list of warnings */
export type ModAssignSaveSubmissionReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type ModAssignSaveSubmissionReturn = ModAssignSaveSubmissionReturns;
export type mod_assign_save_submission_returns = ModAssignSaveSubmissionReturns;
