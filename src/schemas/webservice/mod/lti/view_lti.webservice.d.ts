/** Trigger the course module viewed event and update the module completion status. */
export interface ModLtiViewLtiParams {
    /** lti instance id */
    ltiid: number | null;
}

export interface ModLtiViewLtiReturns {
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

export type ModLtiViewLtiReturn = ModLtiViewLtiReturns;
export type mod_lti_view_lti_returns = ModLtiViewLtiReturns;
