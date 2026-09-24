/** Get courses matching a specific field (id/s, shortname, idnumber, category) */
export interface CoreCourseGetCoursesByFieldParams {
    /** The field to search can be left empty for all courses or: id: course id ids: comma separated course ids shortname: course short name idnumber: course id number category: category id the course belongs to sectionid: section id that belongs to a course */
    field?: string | null;
    /** The value to match */
    value?: string | null;
}

export interface CoreCourseGetCoursesByFieldReturns {
    /** Course */
    courses: Array<{
        /** course id */
        id: number | null;
        /** course full name */
        fullname: string | null;
        /** course display name */
        displayname: string | null;
        /** course short name */
        shortname: string | null;
        /** Course image */
        courseimage?: string | null;
        /** category id */
        categoryid: number | null;
        /** category name */
        categoryname: string | null;
        /** Sort order in the category */
        sortorder?: number | null;
        /** summary */
        summary: string | null;
        /** summary format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        summaryformat: number | null;
        /** summary files in the summary field */
        summaryfiles?: Array<{
            /** File name. */
            filename?: string | null;
            /** File path. */
            filepath?: string | null;
            /** File size. */
            filesize?: number | null;
            /** Downloadable file url. */
            fileurl?: string | null;
            /** Time modified. */
            timemodified?: number | null;
            /** File mime type. */
            mimetype?: string | null;
            /** Whether is an external file. */
            isexternalfile?: boolean | null;
            /** The repository type for external files. */
            repositorytype?: string | null;
            /** The relative path to the relevant file type icon based on the file's mime type. */
            icon?: string | null;
        }>;
        /** additional overview files attached to this course */
        overviewfiles: Array<{
            /** File name. */
            filename?: string | null;
            /** File path. */
            filepath?: string | null;
            /** File size. */
            filesize?: number | null;
            /** Downloadable file url. */
            fileurl?: string | null;
            /** Time modified. */
            timemodified?: number | null;
            /** File mime type. */
            mimetype?: string | null;
            /** Whether is an external file. */
            isexternalfile?: boolean | null;
            /** The repository type for external files. */
            repositorytype?: string | null;
            /** The relative path to the relevant file type icon based on the file's mime type. */
            icon?: string | null;
        }>;
        /** Whether the activity dates are shown or not */
        showactivitydates: boolean | null;
        /** Whether the activity completion conditions are shown or not */
        showcompletionconditions: boolean | null;
        /** contact users */
        contacts: Array<{
            /** contact user id */
            id: number | null;
            /** contact user fullname */
            fullname: string | null;
        }>;
        /** enrollment methods list */
        enrollmentmethods: string | null[];
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
        /** Id number */
        idnumber?: string | null;
        /** Course format: weeks, topics, social, site,.. */
        format?: string | null;
        /** 1 if grades are shown, otherwise 0 */
        showgrades?: number | null;
        /** Number of recent items appearing on the course page */
        newsitems?: number | null;
        /** Timestamp when the course start */
        startdate?: number | null;
        /** Timestamp when the course end */
        enddate?: number | null;
        /** Largest size of file that can be uploaded into */
        maxbytes?: number | null;
        /** Are activity report shown (yes = 1, no =0) */
        showreports?: number | null;
        /** 1: available to student, 0:not available */
        visible?: number | null;
        /** no group, separate, visible */
        groupmode?: number | null;
        /** 1: yes, 0: no */
        groupmodeforce?: number | null;
        /** default grouping id */
        defaultgroupingid?: number | null;
        /** Completion enabled? 1: yes 0: no */
        enablecompletion?: number | null;
        /** 1: yes 0: no */
        completionnotify?: number | null;
        /** Forced course language */
        lang?: string | null;
        /** Fame of the forced theme */
        theme?: string | null;
        /** Current course marker */
        marker?: number | null;
        /** If legacy files are enabled */
        legacyfiles?: number | null;
        /** Calendar type */
        calendartype?: string | null;
        /** Time when the course was created */
        timecreated?: number | null;
        /** Last time the course was updated */
        timemodified?: number | null;
        /** If is a requested course */
        requested?: number | null;
        /** Cache revision number */
        cacherev?: number | null;
        /** Course filters */
        filters?: Array<{
            /** Filter plugin name */
            filter: string | null;
            /** Filter state: 1 for on, -1 for off, 0 if inherit */
            localstate: number | null;
            /** 1 or 0 to use when localstate is set to inherit */
            inheritedstate: number | null;
        }>;
        /** Additional options for particular course format. */
        courseformatoptions?: Array<{
            /** Course format option name. */
            name: string | null;
            /** Course format option value. */
            value: string | null;
        }>;
        /** Communication tool room name. */
        communicationroomname?: string | null;
        /** Communication tool room URL. */
        communicationroomurl?: string | null;
    }>;
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

export type CoreCourseGetCoursesByFieldReturn = CoreCourseGetCoursesByFieldReturns;
export type core_course_get_courses_by_field_returns = CoreCourseGetCoursesByFieldReturns;
