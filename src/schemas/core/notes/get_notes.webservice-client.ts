/** Get notes */
export interface CoreNotesGetNotesParams {
    /** Array of Note Ids to be retrieved. */
    notes: number | null[];
}

export interface CoreNotesGetNotesReturns {
    notes: Array<{
        /** id of the note */
        noteid?: number | null;
        /** id of the user the note is about */
        userid?: number | null;
        /** 'personal', 'course' or 'site' */
        publishstate?: string | null;
        /** course id of the note */
        courseid?: number | null;
        /** the text of the message - text or HTML */
        text?: string | null;
        /** text format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        format?: number | null;
    }>;
    /** list of warnings */
    warnings?: Array<{
        /** item is always 'note' */
        item?: string | null;
        /** When errorcode is savedfailed the note could not be modified.When errorcode is badparam, an incorrect parameter was provided.When errorcode is badid, the note does not exist */
        itemid?: number | null;
        /** errorcode can be badparam (incorrect parameter), savedfailed (could not be modified), or badid (note does not exist) */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type CoreNotesGetNotesReturn = CoreNotesGetNotesReturns;
export type core_notes_get_notes_returns = CoreNotesGetNotesReturns;
