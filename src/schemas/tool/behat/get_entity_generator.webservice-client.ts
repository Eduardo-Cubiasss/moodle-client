/** Get the generator details for an entity */
export interface ToolBehatGetEntityGeneratorParams {
    /** Entity type that can be created by a generator. */
    entitytype: string | null;
}

export interface ToolBehatGetEntityGeneratorReturns {
    /** Required fields */
    required?: string | null[];
}

export type ToolBehatGetEntityGeneratorReturn = ToolBehatGetEntityGeneratorReturns;
export type tool_behat_get_entity_generator_returns = ToolBehatGetEntityGeneratorReturns;
