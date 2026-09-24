/** Update a tool type */
export interface ModLtiUpdateToolTypeParams {
    /** Tool type id */
    id: number | null;
    /** Tool type name */
    name?: string | null;
    /** Tool type description */
    description?: string | null;
    /** Tool type state */
    state?: number | null;
}

/** Tool */
export interface ModLtiUpdateToolTypeReturns {
    /** Tool type id */
    id: number | null;
    /** Tool type name */
    name: string | null;
    /** Tool type description */
    description: string | null;
    /** Platform ID */
    platformid: string | null;
    /** Client ID */
    clientid: string | null;
    /** Deployment ID */
    deploymentid: number | null;
    urls: {
        /** Tool type icon URL */
        icon: string | null;
        /** Tool type edit URL */
        edit: string | null;
        /** Tool type edit URL */
        course?: string | null;
        /** Public Keyset URL */
        publickeyset: string | null;
        /** Access Token URL */
        accesstoken: string | null;
        /** Authorisation Request URL */
        authrequest: string | null;
    };
    state: {
        /** Tool type state name string */
        text: string | null;
        /** Is the state pending */
        pending: boolean | null;
        /** Is the state configured */
        configured: boolean | null;
        /** Is the state rejected */
        rejected: boolean | null;
        /** Is the state unknown */
        unknown: boolean | null;
    };
    /** Indicate if capabilitygroups is populated */
    hascapabilitygroups: boolean | null;
    /** Array of capability groups */
    capabilitygroups?: string | null[];
    /** Tool type course */
    courseid?: number | null;
    /** IDs for the LTI instances using this type */
    instanceids?: number | null[];
    /** The number of times this tool is being used */
    instancecount: number | null;
}

export type ModLtiUpdateToolTypeReturn = ModLtiUpdateToolTypeReturns;
export type mod_lti_update_tool_type_returns = ModLtiUpdateToolTypeReturns;
