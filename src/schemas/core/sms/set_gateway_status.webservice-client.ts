/** Set the sms gateway status */
export interface CoreSmsSetGatewayStatusParams {
    /** Gateway ID */
    plugin: number | null;
    /** Enabled or disabled */
    state: number | null;
}

export interface CoreSmsSetGatewayStatusReturns {
    /** Whether the status was changed, true or false */
    result: boolean | null;
    /** Messages */
    message: string | null;
    /** Message type */
    messagetype: string | null;
}

export type CoreSmsSetGatewayStatusReturn = CoreSmsSetGatewayStatusReturns;
export type core_sms_set_gateway_status_returns = CoreSmsSetGatewayStatusReturns;
