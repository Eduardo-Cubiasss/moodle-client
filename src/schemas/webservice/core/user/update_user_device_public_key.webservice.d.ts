/** Store mobile user public key. */
export interface CoreUserUpdateUserDevicePublicKeyParams {
    /** the device UUID */
    uuid: string | null;
    /** The app id, something like com.moodle.moodlemobile */
    appid: string | null;
    /** the app generated public key */
    publickey: string | null;
}

export interface CoreUserUpdateUserDevicePublicKeyReturns {
    /** Whether the request was successful */
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

export type CoreUserUpdateUserDevicePublicKeyReturn = CoreUserUpdateUserDevicePublicKeyReturns;
export type core_user_update_user_device_public_key_returns = CoreUserUpdateUserDevicePublicKeyReturns;
