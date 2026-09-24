/** Creates new groupings */
export interface CoreGroupCreateGroupingsParams {
    /** List of grouping object. A grouping has a courseid, a name and a description. */
    groupings: Array<{
        /** id of course */
        courseid: number | null;
        /** multilang compatible name, course unique */
        name: string | null;
        /** grouping description text */
        description: string | null;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** id number */
        idnumber?: string | null;
        /** Custom fields */
        customfields?: Array<{
            /** The shortname of the custom field */
            shortname: string | null;
            /** The value of the custom field */
            value: string | null;
        }>;
    }>;
}

/** List of grouping object. A grouping has an id, a courseid, a name and a description. */
export type CoreGroupCreateGroupingsReturns = Array<{
    /** grouping record id */
    id: number | null;
    /** id of course */
    courseid: number | null;
    /** multilang compatible name, course unique */
    name: string | null;
    /** grouping description text */
    description: string | null;
    /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
    descriptionformat: number | null;
    /** id number */
    idnumber: string | null;
    /** Custom fields */
    customfields?: Array<{
        /** The shortname of the custom field */
        shortname: string | null;
        /** The value of the custom field */
        value: string | null;
    }>;
}>;

export type CoreGroupCreateGroupingsReturn = CoreGroupCreateGroupingsReturns;
export type core_group_create_groupings_returns = CoreGroupCreateGroupingsReturns;
