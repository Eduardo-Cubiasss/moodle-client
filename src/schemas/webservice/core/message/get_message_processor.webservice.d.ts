/** Get a message processor */
export interface CoreMessageGetMessageProcessorParams {
    /** id of the user, 0 for current user */
    userid: number | null;
    /** The name of the message processor */
    name: string | null;
}

export interface CoreMessageGetMessageProcessorReturns {
    /** Site configuration status */
    systemconfigured: boolean | null;
    /** The user configuration status */
    userconfigured: boolean | null;
}

export type CoreMessageGetMessageProcessorReturn = CoreMessageGetMessageProcessorReturns;
export type core_message_get_message_processor_returns = CoreMessageGetMessageProcessorReturns;
