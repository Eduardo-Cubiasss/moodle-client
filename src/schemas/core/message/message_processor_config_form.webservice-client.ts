/** Process the message processor config form */
export interface CoreMessageMessageProcessorConfigFormParams {
    /** id of the user, 0 for current user */
    userid: number | null;
    /** The name of the message processor */
    name: string | null;
    /** Config form values */
    formvalues: Array<{
        /** name of the form element */
        name: string | null;
        /** value of the form element */
        value: string | null;
    }>;
}

export type CoreMessageMessageProcessorConfigFormReturns = unknown;

export type CoreMessageMessageProcessorConfigFormReturn = CoreMessageMessageProcessorConfigFormReturns;
export type core_message_message_processor_config_form_returns = CoreMessageMessageProcessorConfigFormReturns;
