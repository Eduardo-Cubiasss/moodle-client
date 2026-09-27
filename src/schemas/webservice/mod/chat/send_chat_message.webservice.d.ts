/** Send a message on the given chat session. */
export interface ModChatSendChatMessageParams {
    /** chat session id (obtained via mod_chat_login_user) */
    chatsid: string | null;
    /** the message text */
    messagetext: string | null;
    /** the beep id */
    beepid?: string | null;
}

export interface ModChatSendChatMessageReturns {
    /** message sent id */
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

export type ModChatSendChatMessageReturn = ModChatSendChatMessageReturns;
export type mod_chat_send_chat_message_returns = ModChatSendChatMessageReturns;
