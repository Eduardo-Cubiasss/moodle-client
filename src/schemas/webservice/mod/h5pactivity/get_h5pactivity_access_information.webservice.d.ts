/** Return access information for a given h5p activity. */
export interface ModH5pactivityGetH5pactivityAccessInformationParams {
    /** h5p activity instance id */
    h5pactivityid: number | null;
}

export interface ModH5pactivityGetH5pactivityAccessInformationReturns {
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
    /** Whether the user has the capability mod/h5pactivity:view allowed. */
    canview?: boolean | null;
    /** Whether the user has the capability mod/h5pactivity:addinstance allowed. */
    canaddinstance?: boolean | null;
    /** Whether the user has the capability mod/h5pactivity:submit allowed. */
    cansubmit?: boolean | null;
    /** Whether the user has the capability mod/h5pactivity:reviewattempts allowed. */
    canreviewattempts?: boolean | null;
}

export type ModH5pactivityGetH5pactivityAccessInformationReturn = ModH5pactivityGetH5pactivityAccessInformationReturns;
export type mod_h5pactivity_get_h5pactivity_access_information_returns = ModH5pactivityGetH5pactivityAccessInformationReturns;
