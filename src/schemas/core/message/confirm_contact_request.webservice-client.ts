/** Confirms a contact request */
export interface CoreMessageConfirmContactRequestParams {
    /** The id of the user making the request */
    userid: number | null;
    /** The id of the user being requested */
    requesteduserid: number | null;
}

/** list of warnings */
export type CoreMessageConfirmContactRequestReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type CoreMessageConfirmContactRequestReturn = CoreMessageConfirmContactRequestReturns;
export type core_message_confirm_contact_request_returns = CoreMessageConfirmContactRequestReturns;
