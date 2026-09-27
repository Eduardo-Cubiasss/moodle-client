/** Set the state of a plugin */
export interface CoreAdminSetPluginStateParams {
    /** The name of the plugin */
    plugin: string | null;
    /** The target state */
    state: number | null;
}

export interface CoreAdminSetPluginStateReturns {}

export type CoreAdminSetPluginStateReturn = CoreAdminSetPluginStateReturns;
export type core_admin_set_plugin_state_returns = CoreAdminSetPluginStateReturns;
