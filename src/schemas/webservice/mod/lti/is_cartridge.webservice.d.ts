/** Determine if the given url is for a cartridge */
export interface ModLtiIsCartridgeParams {
    /** Tool url */
    url: string | null;
}

export interface ModLtiIsCartridgeReturns {
    /** True if the URL is a cartridge */
    iscartridge: boolean | null;
}

export type ModLtiIsCartridgeReturn = ModLtiIsCartridgeReturns;
export type mod_lti_is_cartridge_returns = ModLtiIsCartridgeReturns;
