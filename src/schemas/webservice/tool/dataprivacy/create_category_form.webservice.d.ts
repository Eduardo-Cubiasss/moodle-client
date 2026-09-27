/** Adds a data category */
export interface ToolDataprivacyCreateCategoryFormParams {
    /** The data to create the category, encoded as a json array */
    jsonformdata: string | null;
}

export interface ToolDataprivacyCreateCategoryFormReturns {
    category: {
        /** The category name. */
        name: string;
        /** The category description. */
        description: string | null;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** id */
        id: number;
        /** timecreated */
        timecreated: number;
        /** timemodified */
        timemodified: number;
        /** usermodified */
        usermodified: number;
    };
    /** Were there validation errors */
    validationerrors: boolean | null;
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

export type ToolDataprivacyCreateCategoryFormReturn = ToolDataprivacyCreateCategoryFormReturns;
export type tool_dataprivacy_create_category_form_returns = ToolDataprivacyCreateCategoryFormReturns;
