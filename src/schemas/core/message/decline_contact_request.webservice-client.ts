/** Declines a contact request */
export interface CoreMessageDeclineContactRequestParams {
    /** The id of the user making the request */
    userid: number | null;
    /** The id of the user being requested */
    requesteduserid: number | null;
}

/** list of warnings */
export type CoreMessageDeclineContactRequestReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type CoreMessageDeclineContactRequestReturn = CoreMessageDeclineContactRequestReturns;
export type core_message_decline_contact_request_returns = CoreMessageDeclineContactRequestReturns;
