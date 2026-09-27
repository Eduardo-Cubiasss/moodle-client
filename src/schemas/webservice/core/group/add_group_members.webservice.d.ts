/** Adds group members. */
export interface CoreGroupAddGroupMembersParams {
    members: Array<{
        /** group record id */
        groupid: number | null;
        /** user id */
        userid: number | null;
    }>;
}

export type CoreGroupAddGroupMembersReturns = unknown;

export type CoreGroupAddGroupMembersReturn = CoreGroupAddGroupMembersReturns;
export type core_group_add_group_members_returns = CoreGroupAddGroupMembersReturns;
