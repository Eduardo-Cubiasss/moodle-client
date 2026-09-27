/** Search for entries in the given database. */
export interface ModDataSearchEntriesParams {
    /** data instance id */
    databaseid: number | null;
    /** Group id, 0 means that the function will determine the user group */
    groupid?: number | null;
    /** Whether to return contents or not. */
    returncontents?: boolean | null;
    /** search string (empty when using advanced) */
    search?: string | null;
    /** Advanced search */
    advsearch?: Array<{
        /** Field key for search. Use fn or ln for first or last name */
        name: string | null;
        /** JSON encoded value for search */
        value: string | null;
    }>;
    /** Sort the records by this field id, reserved ids are: 0: timeadded -1: firstname -2: lastname -3: approved -4: timemodified. Empty for using the default database setting. */
    sort?: number | null;
    /** The direction of the sorting: 'ASC' or 'DESC'. Empty for using the default database setting. */
    order?: string | null;
    /** The page of records to return. */
    page?: number | null;
    /** The number of records to return per page */
    perpage?: number | null;
}

export interface ModDataSearchEntriesReturns {
    entries: Array<{
        /** Record id. */
        id: number;
        /** The id of the user who created the record. */
        userid: number;
        /** The group id this record belongs to (0 for no groups). */
        groupid: number;
        /** The database id this record belongs to. */
        dataid: number;
        /** Time the record was created. */
        timecreated: number;
        /** Last time the record was modified. */
        timemodified: number;
        /** Whether the entry has been approved (if the database is configured in that way). */
        approved: boolean;
        /** Whether the current user can manage this entry */
        canmanageentry: boolean;
        /** The user who created the entry fullname. */
        fullname?: string;
        /** The record contents. */
        contents?: Array<{
            /** Content id. */
            id: number;
            /** The field type of the content. */
            fieldid: number;
            /** The record this content belongs to. */
            recordid: number;
            /** Contents. */
            content: string | null;
            /** Contents. */
            content1: string | null;
            /** Contents. */
            content2: string | null;
            /** Contents. */
            content3: string | null;
            /** Contents. */
            content4: string | null;
            /** files */
            files?: Array<{
                /** File name. */
                filename?: string;
                /** File path. */
                filepath?: string;
                /** File size. */
                filesize?: number;
                /** Downloadable file url. */
                fileurl?: string;
                /** Time modified. */
                timemodified?: number;
                /** File mime type. */
                mimetype?: string;
                /** Whether is an external file. */
                isexternalfile?: boolean;
                /** The repository type for the external files. */
                repositorytype?: string | null;
                /** Relative path to the relevant file type icon based on the file's mime type. */
                icon?: string | null;
            }>;
        }>;
        /** Tags. */
        tags?: Array<{
            /** Tag id. */
            id: number;
            /** Tag name. */
            name: string;
            /** The raw, unnormalised name for the tag as entered by users. */
            rawname: string;
            /** Whether this tag is standard. */
            isstandard: boolean;
            /** Tag collection id. */
            tagcollid: number;
            /** Tag instance id. */
            taginstanceid: number;
            /** Context the tag instance belongs to. */
            taginstancecontextid: number;
            /** Id of the record tagged. */
            itemid: number;
            /** Tag ordering. */
            ordering: number;
            /** Whether the tag is flagged as inappropriate. */
            flag: number | null;
            /** The url to view the tag. */
            viewurl?: string | null;
        }>;
    }>;
    /** Total count of records returned by the search. */
    totalcount: number | null;
    /** Total count of records that the user could see in the database (if all the search criterias were removed). */
    maxcount?: number | null;
    /** The list view contents as is rendered in the site. */
    listviewcontents?: string | null;
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

export type ModDataSearchEntriesReturn = ModDataSearchEntriesReturns;
export type mod_data_search_entries_returns = ModDataSearchEntriesReturns;
