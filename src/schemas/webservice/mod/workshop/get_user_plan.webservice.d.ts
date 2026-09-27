/** Return the planner information for the given user. */
export interface ModWorkshopGetUserPlanParams {
    /** Workshop instance id. */
    workshopid: number | null;
    /** User id (empty or 0 for current user). */
    userid?: number | null;
}

export interface ModWorkshopGetUserPlanReturns {
    userplan: {
        phases: Array<{
            /** Phase code. */
            code: number | null;
            /** Phase title. */
            title: string | null;
            /** Whether is the active task. */
            active: boolean | null;
            tasks: Array<{
                /** Task code. */
                code: string | null;
                /** Task title. */
                title: string | null;
                /** Link to task. */
                link: string | null;
                /** Task details. */
                details?: string | null;
                /** Completion information (maybe empty, maybe a boolean or generic info. */
                completed: string | null;
            }>;
            actions: Array<{
                /** Action type. */
                type?: string | null;
                /** Action label. */
                label?: string | null;
                /** Link to action. */
                url: string | null;
                /** Get or post. */
                method?: string | null;
            }>;
        }>;
        examples: Array<{
            /** Example submission id. */
            id: number | null;
            /** Example submission title. */
            title: string | null;
            /** Example submission assessment id. */
            assessmentid: number | null;
            /** The submission grade. */
            grade: number | null;
            /** The assessment grade. */
            gradinggrade: number | null;
        }>;
    };
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

export type ModWorkshopGetUserPlanReturn = ModWorkshopGetUserPlanReturns;
export type mod_workshop_get_user_plan_returns = ModWorkshopGetUserPlanReturns;
