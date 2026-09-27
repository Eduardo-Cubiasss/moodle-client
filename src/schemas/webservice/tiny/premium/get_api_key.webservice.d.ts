/** Get the Tiny Premium API key from Moodle */
export interface TinyPremiumGetApiKeyParams {
    /** The current context ID. */
    contextid: number | null;
}

export interface TinyPremiumGetApiKeyReturns {
    /** The API key for Tiny Premium */
    apikey: string | null;
}

export type TinyPremiumGetApiKeyReturn = TinyPremiumGetApiKeyReturns;
export type tiny_premium_get_api_key_returns = TinyPremiumGetApiKeyReturns;
