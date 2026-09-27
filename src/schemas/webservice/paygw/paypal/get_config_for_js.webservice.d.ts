/** Returns the configuration settings to be used in js */
export interface PaygwPaypalGetConfigForJsParams {
    /** Component */
    component: string | null;
    /** Payment area in the component */
    paymentarea: string | null;
    /** An identifier for payment area in the component */
    itemid: number | null;
}

export interface PaygwPaypalGetConfigForJsReturns {
    /** PayPal client ID */
    clientid: string | null;
    /** Brand name */
    brandname: string | null;
    /** Cost with gateway surcharge */
    cost: number | null;
    /** Currency */
    currency: string | null;
}

export type PaygwPaypalGetConfigForJsReturn = PaygwPaypalGetConfigForJsReturns;
export type paygw_paypal_get_config_for_js_returns = PaygwPaypalGetConfigForJsReturns;
