/** Unblocks a user */
export interface CoreMessageUnblockUserParams {
    /** The id of the user who is unblocking */
    userid: number | null;
    /** The id of the user being unblocked */
    unblockeduserid: number | null;
}

/** list of warnings */
export type CoreMessageUnblockUserReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type CoreMessageUnblockUserReturn = CoreMessageUnblockUserReturns;
export type core_message_unblock_user_returns = CoreMessageUnblockUserReturns;
