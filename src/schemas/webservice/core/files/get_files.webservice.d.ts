/** browse moodle files */
export interface CoreFilesGetFilesParams {
    /** context id Set to -1 to use contextlevel and instanceid. */
    contextid: number | null;
    /** component */
    component: string | null;
    /** file area */
    filearea: string | null;
    /** associated id */
    itemid: number | null;
    /** file path */
    filepath: string | null;
    /** file name */
    filename: string | null;
    /** timestamp to return files changed after this time. */
    modified?: number | null;
    /** The context level for the file location. */
    contextlevel?: string | null;
    /** The instance id for where the file is located. */
    instanceid?: number | null;
}

export interface CoreFilesGetFilesReturns {
    parents: Array<{
        contextid: number | null;
        component: string | null;
        filearea: string | null;
        itemid: number | null;
        filepath: string | null;
        filename: string | null;
    }>;
    files: Array<{
        contextid: number | null;
        component: string | null;
        filearea: string | null;
        itemid: number | null;
        filepath: string | null;
        filename: string | null;
        isdir: boolean | null;
        url: string | null;
        timemodified: number | null;
        /** Time created */
        timecreated?: number | null;
        /** File size */
        filesize?: number | null;
        /** File owner */
        author?: string | null;
        /** File license */
        license?: string | null;
    }>;
}

export type CoreFilesGetFilesReturn = CoreFilesGetFilesReturns;
export type core_files_get_files_returns = CoreFilesGetFilesReturns;
