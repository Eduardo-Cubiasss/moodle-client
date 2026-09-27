/** Returns group members. */
export interface CoreGroupGetGroupMembersParams {
    groupids: Array<number | null>;
}

export type CoreGroupGetGroupMembersReturns = Array<{
    /** group record id */
    groupid: number | null;
    userids: Array<number | null>;
}>;

export type CoreGroupGetGroupMembersReturn = CoreGroupGetGroupMembersReturns;
export type core_group_get_group_members_returns = CoreGroupGetGroupMembersReturns;
