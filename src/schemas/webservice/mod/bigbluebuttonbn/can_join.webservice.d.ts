/** Returns information if the current user can join or not. */
export interface ModBigbluebuttonbnCanJoinParams {
    /** course module id */
    cmid: number | null;
    /** bigbluebuttonbn group id */
    groupid?: number | null;
}

export interface ModBigbluebuttonbnCanJoinReturns {
    /** Can join session */
    can_join: boolean | null;
    /** course module id */
    cmid: number | null;
}

export type ModBigbluebuttonbnCanJoinReturn = ModBigbluebuttonbnCanJoinReturns;
export type mod_bigbluebuttonbn_can_join_returns = ModBigbluebuttonbnCanJoinReturns;
