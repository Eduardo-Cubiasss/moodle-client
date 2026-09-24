/** Takes care of what needs to be done when a PayPal transaction comes back as complete. */
export interface PaygwPaypalCreateTransactionCompleteParams {
    /** The component name */
    component: string | null;
    /** Payment area in the component */
    paymentarea: string | null;
    /** The item id in the context of the component area */
    itemid: number | null;
    /** The order id coming back from PayPal */
    orderid: string | null;
}

export interface PaygwPaypalCreateTransactionCompleteReturns {
    /** Whether everything was successful or not. */
    success: boolean | null;
    /** Message (usually the error message). */
    message: string | null;
}

export type PaygwPaypalCreateTransactionCompleteReturn = PaygwPaypalCreateTransactionCompleteReturns;
export type paygw_paypal_create_transaction_complete_returns = PaygwPaypalCreateTransactionCompleteReturns;
