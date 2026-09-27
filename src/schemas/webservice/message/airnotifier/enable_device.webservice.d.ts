/** Enables or disables a registered user device so it can receive Push notifications */
export interface MessageAirnotifierEnableDeviceParams {
    /** The device id */
    deviceid: number | null;
    /** True for enable the device, false otherwise */
    enable: boolean | null;
}

export interface MessageAirnotifierEnableDeviceReturns {
    /** True if success */
    success: boolean | null;
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

export type MessageAirnotifierEnableDeviceReturn = MessageAirnotifierEnableDeviceReturns;
export type message_airnotifier_enable_device_returns = MessageAirnotifierEnableDeviceReturns;
