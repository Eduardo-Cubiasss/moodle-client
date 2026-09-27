/** Fetch the values for a specific scale */
export interface CoreCompetencyGetScaleValuesParams {
    /** The scale id */
    scaleid: number | null;
}

export type CoreCompetencyGetScaleValuesReturns = Array<{
    /** Scale value ID */
    id: number | null;
    /** Scale value name */
    name: string | null;
}>;

export type CoreCompetencyGetScaleValuesReturn = CoreCompetencyGetScaleValuesReturns;
export type core_competency_get_scale_values_returns = CoreCompetencyGetScaleValuesReturns;
