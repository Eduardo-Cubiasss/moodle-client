/** Trigger the course module viewed event and update the module completion status. */
export interface ModH5pactivityViewH5pactivityParams {
    /** H5P activity instance id */
    h5pactivityid: number | null;
}

export interface ModH5pactivityViewH5pactivityReturns {
    /** status: true if success */
    status: boolean | null;
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

export type ModH5pactivityViewH5pactivityReturn = ModH5pactivityViewH5pactivityReturns;
export type mod_h5pactivity_view_h5pactivity_returns = ModH5pactivityViewH5pactivityReturns;
