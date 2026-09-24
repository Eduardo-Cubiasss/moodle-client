/** Remove a user device from the Moodle database. */
export interface CoreUserRemoveUserDeviceParams {
    /** the device UUID */
    uuid: string | null;
    /** the app id, if empty devices matching the UUID for the user will be removed */
    appid?: string | null;
}

export interface CoreUserRemoveUserDeviceReturns {
    /** True if removed, false if not removed because it doesn't exists */
    removed: boolean | null;
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

export type CoreUserRemoveUserDeviceReturn = CoreUserRemoveUserDeviceReturns;
export type core_user_remove_user_device_returns = CoreUserRemoveUserDeviceReturns;
