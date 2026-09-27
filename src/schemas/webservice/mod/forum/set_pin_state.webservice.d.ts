/** Set the pin state */
export interface ModForumSetPinStateParams {
    /** The discussion to pin or unpin */
    discussionid: number;
    /** The target state */
    targetstate: number;
}

export interface ModForumSetPinStateReturns {
    /** id */
    id: number;
    /** forumid */
    forumid: number;
    /** pinned */
    pinned: boolean;
    /** locked */
    locked: boolean;
    /** istimelocked */
    istimelocked: boolean;
    /** name */
    name: string;
    /** firstpostid */
    firstpostid: number;
    group?: {
        /** name */
        name: string;
        urls: {
            /** picture */
            picture?: string;
            /** userlist */
            userlist?: string;
        };
    };
    times: {
        /** modified */
        modified: number;
        /** start */
        start: number;
        /** end */
        end: number;
        /** locked */
        locked: number;
    };
    userstate: {
        /** subscribed */
        subscribed: boolean;
        /** favourited */
        favourited: boolean;
    };
    capabilities: {
        /** subscribe */
        subscribe: boolean;
        /** move */
        move: boolean;
        /** pin */
        pin: boolean;
        /** post */
        post: boolean;
        /** manage */
        manage: boolean;
        /** favourite */
        favourite: boolean;
    };
    urls: {
        /** view */
        view: string;
        /** viewlatest */
        viewlatest?: string;
        /** viewfirstunread */
        viewfirstunread?: string;
        /** markasread */
        markasread: string;
        /** subscribe */
        subscribe: string;
        /** pin */
        pin?: string;
    };
    timed: {
        /** istimed */
        istimed?: boolean | null;
        /** visible */
        visible?: boolean | null;
    };
}

export type ModForumSetPinStateReturn = ModForumSetPinStateReturns;
export type mod_forum_set_pin_state_returns = ModForumSetPinStateReturns;
