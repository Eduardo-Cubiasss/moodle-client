/** Adds a data purpose */
export interface ToolDataprivacyCreatePurposeFormParams {
    /** The data to create the purpose, encoded as a json array */
    jsonformdata: string | null;
}

export interface ToolDataprivacyCreatePurposeFormReturns {
    purpose: {
        /** The purpose name. */
        name: string;
        /** The purpose description. */
        description: string | null;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** Comma-separated IDs matching records in tool_dataprivacy_lawfulbasis. */
        lawfulbases: string;
        /** Comma-separated IDs matching records in tool_dataprivacy_sensitive */
        sensitivedatareasons: string | null;
        /** Retention period. ISO_8601 durations format (as in DateInterval format). */
        retentionperiod: string;
        /** Data retention with higher precedent over user's request to be forgotten. */
        protected: number;
        /** id */
        id: number;
        /** timecreated */
        timecreated: number;
        /** timemodified */
        timemodified: number;
        /** usermodified */
        usermodified: number;
        /** formattedretentionperiod */
        formattedretentionperiod: string;
        /** formattedlawfulbases */
        formattedlawfulbases: Array<{
            /** name */
            name: string;
            /** description */
            description: string;
        }>;
        /** formattedsensitivedatareasons */
        formattedsensitivedatareasons?: Array<{
            /** name */
            name: string;
            /** description */
            description: string;
        }>;
        /** roleoverrides */
        roleoverrides: string;
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

export type ToolDataprivacyCreatePurposeFormReturn = ToolDataprivacyCreatePurposeFormReturns;
export type tool_dataprivacy_create_purpose_form_returns = ToolDataprivacyCreatePurposeFormReturns;
