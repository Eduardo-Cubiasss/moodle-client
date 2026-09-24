/** Remove contacts from the contact list */
export interface CoreMessageDeleteContactsParams {
    /** List of user IDs */
    userids: number | null[];
    /** The id of the user we are deleting the contacts for, 0 for the current user */
    userid?: number | null;
}

export type CoreMessageDeleteContactsReturns = unknown;

export type CoreMessageDeleteContactsReturn = CoreMessageDeleteContactsReturns;
export type core_message_delete_contacts_returns = CoreMessageDeleteContactsReturns;
