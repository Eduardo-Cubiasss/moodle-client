/** Deletes a message. */
export interface CoreMessageDeleteMessageParams {
    /** The message id */
    messageid: number | null;
    /** The user id of who we want to delete the message for */
    userid: number | null;
    /** If is a message read */
    read?: boolean | null;
}

export interface CoreMessageDeleteMessageReturns {
    /** True if the message was deleted, false otherwise */
    status: boolean | null;
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

export type CoreMessageDeleteMessageReturn = CoreMessageDeleteMessageReturns;
export type core_message_delete_message_returns = CoreMessageDeleteMessageReturns;
