/** Trigger the course module viewed event and update the module completion status. */
export interface ModWorkshopViewWorkshopParams {
    /** Workshop instance id */
    workshopid: number | null;
}

export interface ModWorkshopViewWorkshopReturns {
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

export type ModWorkshopViewWorkshopReturn = ModWorkshopViewWorkshopReturns;
export type mod_workshop_view_workshop_returns = ModWorkshopViewWorkshopReturns;
