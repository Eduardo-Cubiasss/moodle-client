/** Validate completion */
export interface ModBigbluebuttonbnCompletionValidateParams {
    /** bigbluebuttonbn instance id */
    bigbluebuttonbnid: number | null;
}

export interface ModBigbluebuttonbnCompletionValidateReturns {
    /** list of warnings */
    warnings?: Array<{
        /** item */
        item?: string | null;
        /** item id */
        itemid?: number | null;
        /** the warning code can be used by the client app to implement specific behaviour */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type ModBigbluebuttonbnCompletionValidateReturn = ModBigbluebuttonbnCompletionValidateReturns;
export type mod_bigbluebuttonbn_completion_validate_returns = ModBigbluebuttonbnCompletionValidateReturns;
