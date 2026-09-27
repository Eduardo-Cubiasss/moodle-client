/** Deletes a message for all users. */
export interface CoreMessageDeleteMessageForAllUsersParams {
    /** The message id */
    messageid: number | null;
    /** The user id of who we want to delete the message for all users */
    userid: number | null;
}

/** list of warnings */
export type CoreMessageDeleteMessageForAllUsersReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type CoreMessageDeleteMessageForAllUsersReturn = CoreMessageDeleteMessageForAllUsersReturns;
export type core_message_delete_message_for_all_users_returns = CoreMessageDeleteMessageForAllUsersReturns;
