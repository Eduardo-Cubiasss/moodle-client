/** Save list of selected courses for export */
export interface ToolDataprivacySubmitSelectedCoursesFormParams {
    /** The id of data request */
    requestid: number | null;
    /** The data of selected courses form, encoded as a json array */
    jsonformdata: string | null;
}

export interface ToolDataprivacySubmitSelectedCoursesFormReturns {
    /** The processing result */
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

export type ToolDataprivacySubmitSelectedCoursesFormReturn = ToolDataprivacySubmitSelectedCoursesFormReturns;
export type tool_dataprivacy_submit_selected_courses_form_returns = ToolDataprivacySubmitSelectedCoursesFormReturns;
