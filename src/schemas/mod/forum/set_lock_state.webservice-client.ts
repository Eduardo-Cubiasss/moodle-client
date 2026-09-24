/** Set the lock state for the discussion */
export interface ModForumSetLockStateParams {
    /** Forum that the discussion is in */
    forumid: number | null;
    /** The discussion to lock / unlock */
    discussionid: number | null;
    /** The timestamp for the lock state */
    targetstate: number | null;
}

export interface ModForumSetLockStateReturns {
    /** The discussion we are locking. */
    id: number | null;
    /** The locked state of the discussion. */
    locked: boolean | null;
    times: {
        /** The locked time of the discussion. */
        locked: number | null;
    };
}

export type ModForumSetLockStateReturn = ModForumSetLockStateReturns;
export type mod_forum_set_lock_state_returns = ModForumSetLockStateReturns;
