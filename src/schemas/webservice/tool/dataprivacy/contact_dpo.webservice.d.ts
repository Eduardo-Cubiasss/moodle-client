/** Contact the site Data Protection Officer(s) */
export interface ToolDataprivacyContactDpoParams {
    /** The user's message to the Data Protection Officer(s) */
    message: string | null;
}

export interface ToolDataprivacyContactDpoReturns {
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

export type ToolDataprivacyContactDpoReturn = ToolDataprivacyContactDpoReturns;
export type tool_dataprivacy_contact_dpo_returns = ToolDataprivacyContactDpoReturns;
