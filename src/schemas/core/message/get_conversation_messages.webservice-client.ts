/** Retrieve the conversation messages and relevant member information */
export interface CoreMessageGetConversationMessagesParams {
    /** The current user's id */
    currentuserid: number | null;
    /** The conversation id */
    convid: number | null;
    /** Limit from */
    limitfrom?: number | null;
    /** Limit number */
    limitnum?: number | null;
    /** Newest first? */
    newest?: boolean | null;
    /** The timestamp from which the messages were created */
    timefrom?: number | null;
}

export interface CoreMessageGetConversationMessagesReturns {
    /** The conversation id */
    id: number | null;
    members: Array<{
        /** The user id */
        id: number | null;
        /** The user's name */
        fullname: string | null;
        /** The link to the user's profile page */
        profileurl: string | null;
        /** User picture URL */
        profileimageurl: string | null;
        /** Small user picture URL */
        profileimageurlsmall: string | null;
        /** The user's online status */
        isonline: boolean | null;
        /** Show the user's online status? */
        showonlinestatus: boolean | null;
        /** If the user has been blocked */
        isblocked: boolean | null;
        /** Is the user a contact? */
        iscontact: boolean | null;
        /** Is the user deleted? */
        isdeleted: boolean | null;
        /** If the user can still message even if they get blocked */
        canmessageevenifblocked: boolean | null;
        /** If the user can be messaged */
        canmessage: boolean | null;
        /** If the user requires to be contacts */
        requirescontact: boolean | null;
        /** Is the user permitted to add a contact */
        cancreatecontact: boolean | null;
        /** The contact requests */
        contactrequests?: Array<{
            /** The id of the contact request */
            id: number | null;
            /** The id of the user who created the contact request */
            userid: number | null;
            /** The id of the user confirming the request */
            requesteduserid: number | null;
            /** The timecreated timestamp for the contact request */
            timecreated: number | null;
        }>;
        /** Conversations between users */
        conversations?: Array<{
            /** Conversations id */
            id: number | null;
            /** Conversation type: private or public */
            type: number | null;
            /** Multilang compatible conversation name2 */
            name: string | null;
            /** The timecreated timestamp for the conversation */
            timecreated: number | null;
        }>;
    }>;
    messages: Array<{
        /** The id of the message */
        id: number | null;
        /** The id of the user who sent the message */
        useridfrom: number | null;
        /** The text of the message */
        text: string | null;
        /** The timecreated timestamp for the message */
        timecreated: number | null;
    }>;
}

export type CoreMessageGetConversationMessagesReturn = CoreMessageGetConversationMessagesReturns;
export type core_message_get_conversation_messages_returns = CoreMessageGetConversationMessagesReturns;
