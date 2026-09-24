/** Mark a single message as read, trigger message_viewed event. */
export interface CoreMessageMarkMessageReadParams {
    /** id of the message in the messages table */
    messageid: number | null;
    /** timestamp for when the message should be marked read */
    timeread?: number | null;
}

export interface CoreMessageMarkMessageReadReturns {
    /** the id of the message in the messages table */
    messageid: number | null;
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

export type CoreMessageMarkMessageReadReturn = CoreMessageMarkMessageReadReturns;
export type core_message_mark_message_read_returns = CoreMessageMarkMessageReadReturns;
