/** Returns all notes in specified course (or site), for the specified user. */
export interface CoreNotesGetCourseNotesParams {
    /** course id, 0 for SITE */
    courseid: number | null;
    /** user id */
    userid?: number | null;
}

/** notes */
export interface CoreNotesGetCourseNotesReturns {
    /** site notes */
    sitenotes?: Array<{
        /** id of this note */
        id: number | null;
        /** id of the course */
        courseid: number | null;
        /** user id */
        userid: number | null;
        /** the content text formated */
        content: string | null;
        /** content format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        format: number | null;
        /** time created (timestamp) */
        created: number | null;
        /** time of last modification (timestamp) */
        lastmodified: number | null;
        /** user id of the creator of this note */
        usermodified: number | null;
        /** state of the note (i.e. draft, public, site) */
        publishstate: string | null;
    }>;
    /** couse notes */
    coursenotes?: Array<{
        /** id of this note */
        id: number | null;
        /** id of the course */
        courseid: number | null;
        /** user id */
        userid: number | null;
        /** the content text formated */
        content: string | null;
        /** content format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        format: number | null;
        /** time created (timestamp) */
        created: number | null;
        /** time of last modification (timestamp) */
        lastmodified: number | null;
        /** user id of the creator of this note */
        usermodified: number | null;
        /** state of the note (i.e. draft, public, site) */
        publishstate: string | null;
    }>;
    /** personal notes */
    personalnotes?: Array<{
        /** id of this note */
        id: number | null;
        /** id of the course */
        courseid: number | null;
        /** user id */
        userid: number | null;
        /** the content text formated */
        content: string | null;
        /** content format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        format: number | null;
        /** time created (timestamp) */
        created: number | null;
        /** time of last modification (timestamp) */
        lastmodified: number | null;
        /** user id of the creator of this note */
        usermodified: number | null;
        /** state of the note (i.e. draft, public, site) */
        publishstate: string | null;
    }>;
    /** Whether the user can manage notes at system level. */
    canmanagesystemnotes?: boolean | null;
    /** Whether the user can manage notes at the given course. */
    canmanagecoursenotes?: boolean | null;
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

export type CoreNotesGetCourseNotesReturn = CoreNotesGetCourseNotesReturns;
export type core_notes_get_course_notes_returns = CoreNotesGetCourseNotesReturns;
