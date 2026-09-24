/** Returns groupings details. */
export interface CoreGroupGetGroupingsParams {
    /** List of grouping id. A grouping id is an integer. */
    groupingids: number | null[];
    /** return associated groups */
    returngroups?: boolean | null;
}

export type CoreGroupGetGroupingsReturns = Array<{
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
        /** The name of the custom field */
        name: string | null;
        /** The shortname of the custom field - to be able to build the field class in the code */
        shortname: string | null;
        /** The type of the custom field - text field, checkbox... */
        type: string | null;
        /** The raw value of the custom field */
        valueraw: string | null;
        /** The value of the custom field */
        value: string | null;
    }>;
    /** optional groups */
    groups?: Array<{
        /** group record id */
        id: number | null;
        /** id of course */
        courseid: number | null;
        /** multilang compatible name, course unique */
        name: string | null;
        /** group description text */
        description: string | null;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat: number | null;
        /** group enrol secret phrase */
        enrolmentkey: string | null;
        /** id number */
        idnumber: string | null;
        /** Custom fields */
        customfields?: Array<{
            /** The name of the custom field */
            name: string | null;
            /** The shortname of the custom field - to be able to build the field class in the code */
            shortname: string | null;
            /** The type of the custom field - text field, checkbox... */
            type: string | null;
            /** The raw value of the custom field */
            valueraw: string | null;
            /** The value of the custom field */
            value: string | null;
        }>;
    }>;
}>;

export type CoreGroupGetGroupingsReturn = CoreGroupGetGroupingsReturns;
export type core_group_get_groupings_returns = CoreGroupGetGroupingsReturns;
