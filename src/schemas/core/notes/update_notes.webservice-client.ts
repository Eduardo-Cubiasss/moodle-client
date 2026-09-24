/** Update notes */
export interface CoreNotesUpdateNotesParams {
    /** Array of Notes */
    notes?: Array<{
        /** id of the note */
        id: number | null;
        /** 'personal', 'course' or 'site' */
        publishstate: string | null;
        /** the text of the message - text or HTML */
        text: string | null;
        /** text format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        format?: number | null;
    }>;
}

/** list of warnings */
export type CoreNotesUpdateNotesReturns = Array<{
    /** item is always 'note' */
    item?: string | null;
    /** When errorcode is savedfailed the note could not be modified.When errorcode is badparam, an incorrect parameter was provided.When errorcode is badid, the note does not exist */
    itemid?: number | null;
    /** errorcode can be badparam (incorrect parameter), savedfailed (could not be modified), or badid (note does not exist) */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type CoreNotesUpdateNotesReturn = CoreNotesUpdateNotesReturns;
export type core_notes_update_notes_returns = CoreNotesUpdateNotesReturns;
