/** Sets purpose and category for a specific context */
export interface ToolDataprivacySetContextFormParams {
    /** The context level data, encoded as a json array */
    jsonformdata: string | null;
}

export interface ToolDataprivacySetContextFormReturns {
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

export type ToolDataprivacySetContextFormReturn = ToolDataprivacySetContextFormReturns;
export type tool_dataprivacy_set_context_form_returns = ToolDataprivacySetContextFormReturns;
