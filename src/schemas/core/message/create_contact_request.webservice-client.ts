/** Creates a contact request */
export interface CoreMessageCreateContactRequestParams {
    /** The id of the user making the request */
    userid: number | null;
    /** The id of the user being requested */
    requesteduserid: number | null;
}

export interface CoreMessageCreateContactRequestReturns {
    /** request record */
    request?: {
        /** Message id */
        id: number | null;
        /** User from id */
        userid: number | null;
        /** User to id */
        requesteduserid: number | null;
        /** Time created */
        timecreated: number | null;
    };
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

export type CoreMessageCreateContactRequestReturn = CoreMessageCreateContactRequestReturns;
export type core_message_create_contact_request_returns = CoreMessageCreateContactRequestReturns;
