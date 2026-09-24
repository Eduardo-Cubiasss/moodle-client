/** Takes back a FINALIZED or a recognized subject and decides those courses again from what this site knows. Called by course-state-service. */
export interface LocalCoursestateRevokeDecisionParams {
    /** The decisions to take back, by the student and the subject they were about */
    pairs: Array<{
        /** The student, by their Moodle id */
        userid: number | null;
        /** Any course teaching the subject, by its Moodle id. Not needed when the subject is named */
        courseid?: number | null;
        /** The subject itself, as the catalogue names it. Preferred: it does not depend on this site having a course for it */
        subjectuuid?: string | null;
    }>;
}

export interface LocalCoursestateRevokeDecisionReturns {
    /** How many of the pairs had a decision that has now been taken back */
    revoked: number | null;
}

export type LocalCoursestateRevokeDecisionReturn = LocalCoursestateRevokeDecisionReturns;
export type local_coursestate_revoke_decision_returns = LocalCoursestateRevokeDecisionReturns;
