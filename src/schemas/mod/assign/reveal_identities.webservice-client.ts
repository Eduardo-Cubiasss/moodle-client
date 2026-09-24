/** Reveal the identities for a blind marking assignment */
export interface ModAssignRevealIdentitiesParams {
    /** The assignment id to operate on */
    assignmentid: number | null;
}

/** list of warnings */
export type ModAssignRevealIdentitiesReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type ModAssignRevealIdentitiesReturn = ModAssignRevealIdentitiesReturns;
export type mod_assign_reveal_identities_returns = ModAssignRevealIdentitiesReturns;
