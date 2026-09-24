/** Fetches a list of data category options */
export interface ToolDataprivacyGetCategoryOptionsParams {
    /** Include option "Inherit" */
    includeinherit?: boolean | null;
    /** Include option "Not set" */
    includenotset?: boolean | null;
}

export interface ToolDataprivacyGetCategoryOptionsReturns {
    options: Array<{
        /** The category ID */
        id: number | null;
        /** The category name */
        name: string | null;
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

export type ToolDataprivacyGetCategoryOptionsReturn = ToolDataprivacyGetCategoryOptionsReturns;
export type tool_dataprivacy_get_category_options_returns = ToolDataprivacyGetCategoryOptionsReturns;
