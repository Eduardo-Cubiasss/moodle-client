/** Returns blocks information for the given user dashboard. */
export interface CoreBlockGetDashboardBlocksParams {
    /** User id (optional), default is current user. */
    userid?: number | null;
    /** Whether to return the block contents. */
    returncontents?: boolean | null;
    /** What my page to return blocks of */
    mypage?: string | null;
}

export interface CoreBlockGetDashboardBlocksReturns {
    /** List of blocks in the dashboard. */
    blocks: Array<{
        /** Block instance id. */
        instanceid: number | null;
        /** Block name. */
        name: string | null;
        /** Block region. */
        region: string | null;
        /** Position id. */
        positionid: number | null;
        /** Whether the block is collapsible. */
        collapsible: boolean | null;
        /** Whether the block is dockable. */
        dockable: boolean | null;
        /** Used to order blocks within a region. */
        weight?: number | null;
        /** Whether the block is visible. */
        visible?: boolean | null;
        /** Block contents (if required). */
        contents?: {
            /** Block title. */
            title: string | null;
            /** Block contents. */
            content: string | null;
            /** content format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
            contentformat: number | null;
            /** Block footer. */
            footer: string | null;
            /** Block files. */
            files: Array<{
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
        };
        /** Block instance and plugin configuration settings. */
        configs?: Array<{
            /** Name. */
            name: string | null;
            /** JSON encoded representation of the config value. */
            value: string | null;
            /** Type (instance or plugin). */
            type: string | null;
        }>;
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

export type CoreBlockGetDashboardBlocksReturn = CoreBlockGetDashboardBlocksReturns;
export type core_block_get_dashboard_blocks_returns = CoreBlockGetDashboardBlocksReturns;
