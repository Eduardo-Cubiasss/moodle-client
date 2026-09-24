/** Updates existing groupings */
export interface CoreGroupUpdateGroupingsParams {
    /** List of grouping object. A grouping has a courseid, a name and a description. */
    groupings: Array<{
        /** id of grouping */
        id: number | null;
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

export type CoreGroupUpdateGroupingsReturns = unknown;

export type CoreGroupUpdateGroupingsReturn = CoreGroupUpdateGroupingsReturns;
export type core_group_update_groupings_returns = CoreGroupUpdateGroupingsReturns;
