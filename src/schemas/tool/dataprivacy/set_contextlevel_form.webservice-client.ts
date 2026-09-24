/** Sets purpose and category across a context level */
export interface ToolDataprivacySetContextlevelFormParams {
    /** The context level data, encoded as a json array */
    jsonformdata: string | null;
}

export interface ToolDataprivacySetContextlevelFormReturns {
    /** Whether the data was properly set or not */
    result: boolean | null;
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

export type ToolDataprivacySetContextlevelFormReturn = ToolDataprivacySetContextlevelFormReturns;
export type tool_dataprivacy_set_contextlevel_form_returns = ToolDataprivacySetContextlevelFormReturns;
