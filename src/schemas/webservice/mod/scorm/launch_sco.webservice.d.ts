/** Trigger the SCO launched event. */
export interface ModScormLaunchScoParams {
    /** SCORM instance id */
    scormid: number | null;
    /** SCO id (empty for launching the first SCO) */
    scoid?: number | null;
}

export interface ModScormLaunchScoReturns {
    /** status: true if success */
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

export type ModScormLaunchScoReturn = ModScormLaunchScoReturns;
export type mod_scorm_launch_sco_returns = ModScormLaunchScoReturns;
