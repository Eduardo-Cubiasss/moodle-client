/** Manual role unassignments. */
export interface CoreRoleUnassignRolesParams {
    unassignments: Array<{
        /** Role to assign to the user */
        roleid: number | null;
        /** The user that is going to be assigned */
        userid: number | null;
        /** The context to unassign the user role from */
        contextid?: number | null;
        /** The context level to unassign the user role in + (block, course, coursecat, system, user, module) */
        contextlevel?: string | null;
        /** The Instance id of item where the role needs to be unassigned */
        instanceid?: number | null;
    }>;
}

export type CoreRoleUnassignRolesReturns = unknown;

export type CoreRoleUnassignRolesReturn = CoreRoleUnassignRolesReturns;
export type core_role_unassign_roles_returns = CoreRoleUnassignRolesReturns;
