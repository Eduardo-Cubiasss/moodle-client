/** Delete notes */
export interface CoreNotesDeleteNotesParams {
    /** Array of Note Ids to be deleted. */
    notes: number | null[];
}

/** list of warnings */
export type CoreNotesDeleteNotesReturns = Array<{
    /** item is always 'note' */
    item?: string | null;
    /** When errorcode is savedfailed the note could not be modified.When errorcode is badparam, an incorrect parameter was provided.When errorcode is badid, the note does not exist */
    itemid?: number | null;
    /** errorcode can be badparam (incorrect parameter), savedfailed (could not be modified), or badid (note does not exist) */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type CoreNotesDeleteNotesReturn = CoreNotesDeleteNotesReturns;
export type core_notes_delete_notes_returns = CoreNotesDeleteNotesReturns;
