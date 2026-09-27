/** Simulate the view.php web interface imscp: trigger events, completion, etc... */
export interface ModImscpViewImscpParams {
    /** imscp instance id */
    imscpid: number | null;
}

export interface ModImscpViewImscpReturns {
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

export type ModImscpViewImscpReturn = ModImscpViewImscpReturns;
export type mod_imscp_view_imscp_returns = ModImscpViewImscpReturns;
