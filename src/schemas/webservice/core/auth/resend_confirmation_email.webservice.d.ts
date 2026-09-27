/** Resend confirmation email. */
export interface CoreAuthResendConfirmationEmailParams {
    /** Username. */
    username: string | null;
    /** Plain text password. */
    password: string | null;
    /** Redirect the user to this site url after confirmation. */
    redirect?: string | null;
}

export interface CoreAuthResendConfirmationEmailReturns {
    /** True if the confirmation email was sent, false otherwise. */
    status: boolean | null;
    /** list of warnings */
    warnings?: Array<{
        /** item */
        item?: string | null;
        /** item id */
        itemid?: number | null;
        /** the warning code can be used by the client app to implement specific behaviour */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type CoreAuthResendConfirmationEmailReturn = CoreAuthResendConfirmationEmailReturns;
export type core_auth_resend_confirmation_email_returns = CoreAuthResendConfirmationEmailReturns;
