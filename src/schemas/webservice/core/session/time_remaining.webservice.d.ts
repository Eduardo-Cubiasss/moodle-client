/** Count the seconds remaining in this session */
export interface CoreSessionTimeRemainingParams {}

export interface CoreSessionTimeRemainingReturns {
    /** The current user id. */
    userid: number | null;
    /** The number of seconds remaining in this session. */
    timeremaining: number | null;
}

export type CoreSessionTimeRemainingReturn = CoreSessionTimeRemainingReturns;
export type core_session_time_remaining_returns = CoreSessionTimeRemainingReturns;
