/** Get the list of payment gateways that support the given component/area */
export interface CorePaymentGetAvailableGatewaysParams {
    /** Component */
    component: string | null;
    /** Payment area in the component */
    paymentarea: string | null;
    /** An identifier for payment area in the component */
    itemid: number | null;
}

export type CorePaymentGetAvailableGatewaysReturns = Array<{
    /** Name of the plugin */
    shortname: string | null;
    /** Human readable name of the gateway */
    name: string | null;
    /** description of the gateway */
    description: string | null;
    /** percentage of surcharge when using the gateway */
    surcharge: number | null;
    /** Cost in human-readable form (amount plus surcharge with currency sign) */
    cost: string | null;
}>;

export type CorePaymentGetAvailableGatewaysReturn = CorePaymentGetAvailableGatewaysReturns;
export type core_payment_get_available_gateways_returns = CorePaymentGetAvailableGatewaysReturns;
