/** Set the protection state for a block plugin */
export interface CoreAdminSetBlockProtectionParams {
    /** The name of the plugin */
    plugin: string | null;
    /** The target state */
    state: number | null;
}

export interface CoreAdminSetBlockProtectionReturns {}

export type CoreAdminSetBlockProtectionReturn = CoreAdminSetBlockProtectionReturns;
export type core_admin_set_block_protection_returns = CoreAdminSetBlockProtectionReturns;
