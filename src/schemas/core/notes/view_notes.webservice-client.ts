/** Simulates the web interface view of notes/index.php: trigger events. */
export interface CoreNotesViewNotesParams {
    /** course id, 0 for notes at system level */
    courseid: number | null;
    /** user id, 0 means view all the user notes */
    userid?: number | null;
}

export interface CoreNotesViewNotesReturns {
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

export type CoreNotesViewNotesReturn = CoreNotesViewNotesReturns;
export type core_notes_view_notes_returns = CoreNotesViewNotesReturns;
