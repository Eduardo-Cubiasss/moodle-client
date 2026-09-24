/** Returns a piece of content to be displayed in the Mobile app. */
export interface ToolMobileGetContentParams {
    /** Component where the class is e.g. mod_assign. */
    component: string | null;
    /** Method to execute in class \$component\output\mobile. */
    method: string | null;
    /** Args for the method are optional. */
    args?: Array<{
        /** Param name. */
        name: string | null;
        /** Param value. */
        value: string | null;
    }>;
}

export interface ToolMobileGetContentReturns {
    /** Templates required by the generated content. */
    templates: Array<{
        /** ID of the template. */
        id: string | null;
        /** HTML code. */
        html: string | null;
    }>;
    /** JavaScript code. */
    javascript: string | null;
    /** Other data that can be used or manipulated by the template via 2-way data-binding. */
    otherdata: Array<{
        /** Field name. */
        name: string | null;
        /** Field value. */
        value: string | null;
    }>;
    /** Files in the content. */
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
    /** Restrict this content to certain users or courses. */
    restrict: {
        /** List of allowed users. */
        users?: number | null[];
        /** List of allowed courses. */
        courses?: number | null[];
    };
    /** Whether we consider this disabled or not. */
    disabled?: boolean | null;
}

export type ToolMobileGetContentReturn = ToolMobileGetContentReturns;
export type tool_mobile_get_content_returns = ToolMobileGetContentReturns;
