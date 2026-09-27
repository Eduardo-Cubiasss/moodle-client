/** Create an evidence of prior learning relationship with a competency. */
export interface CoreCompetencyCreateUserEvidenceCompetencyParams {
    /** The user evidence ID. */
    userevidenceid: number | null;
    /** The competency ID. */
    competencyid: number | null;
}

export interface CoreCompetencyCreateUserEvidenceCompetencyReturns {
    /** userevidenceid */
    userevidenceid: number;
    /** competencyid */
    competencyid: number;
    /** id */
    id: number;
    /** timecreated */
    timecreated: number;
    /** timemodified */
    timemodified: number;
    /** usermodified */
    usermodified: number;
}

export type CoreCompetencyCreateUserEvidenceCompetencyReturn = CoreCompetencyCreateUserEvidenceCompetencyReturns;
export type core_competency_create_user_evidence_competency_returns = CoreCompetencyCreateUserEvidenceCompetencyReturns;
