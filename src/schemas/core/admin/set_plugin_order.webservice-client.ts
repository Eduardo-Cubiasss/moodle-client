/** Set the order of a plugin */
export interface CoreAdminSetPluginOrderParams {
    /** The name of the plugin */
    plugin: string | null;
    /** The direction to move */
    direction: number | null;
}

export interface CoreAdminSetPluginOrderReturns {}

export type CoreAdminSetPluginOrderReturn = CoreAdminSetPluginOrderReturns;
export type core_admin_set_plugin_order_returns = CoreAdminSetPluginOrderReturns;
