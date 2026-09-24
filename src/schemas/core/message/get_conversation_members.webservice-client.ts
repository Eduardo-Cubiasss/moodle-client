/** Retrieve a list of members in a conversation */
export interface CoreMessageGetConversationMembersParams {
    /** The id of the user we are performing this action on behalf of */
    userid: number | null;
    /** The id of the conversation */
    conversationid: number | null;
    /** Do we want to include contact requests? */
    includecontactrequests?: boolean | null;
    /** Do we want to include privacy info? */
    includeprivacyinfo?: boolean | null;
    /** Limit from */
    limitfrom?: number | null;
    /** Limit number */
    limitnum?: number | null;
}

export type CoreMessageGetConversationMembersReturns = Array<{
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

export type CoreMessageGetConversationMembersReturn = CoreMessageGetConversationMembersReturns;
export type core_message_get_conversation_members_returns = CoreMessageGetConversationMembersReturns;
