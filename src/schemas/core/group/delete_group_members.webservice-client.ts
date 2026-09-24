/** Deletes group members. */
export interface CoreGroupDeleteGroupMembersParams {
    members: Array<{
        /** group record id */
        groupid: number | null;
        /** user id */
        userid: number | null;
    }>;
}

export type CoreGroupDeleteGroupMembersReturns = unknown;

export type CoreGroupDeleteGroupMembersReturn = CoreGroupDeleteGroupMembersReturns;
export type core_group_delete_group_members_returns = CoreGroupDeleteGroupMembersReturns;
