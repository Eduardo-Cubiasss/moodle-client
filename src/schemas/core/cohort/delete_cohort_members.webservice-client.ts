/** Deletes cohort members. */
export interface CoreCohortDeleteCohortMembersParams {
    members: Array<{
        /** cohort record id */
        cohortid: number | null;
        /** user id */
        userid: number | null;
    }>;
}

export type CoreCohortDeleteCohortMembersReturns = unknown;

export type CoreCohortDeleteCohortMembersReturn = CoreCohortDeleteCohortMembersReturns;
export type core_cohort_delete_cohort_members_returns = CoreCohortDeleteCohortMembersReturns;
