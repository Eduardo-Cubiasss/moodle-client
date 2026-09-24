/** Reloads template */
export interface CoreCustomfieldReloadTemplateParams {
    /** component */
    component: string | null;
    /** area */
    area: string | null;
    /** itemid */
    itemid: number | null;
}

export interface CoreCustomfieldReloadTemplateReturns {
    /** component */
    component: string | null;
    /** area */
    area: string | null;
    /** itemid */
    itemid: number | null;
    /** view has categories */
    usescategories: boolean | null;
    categories: Array<{
        /** id */
        id: number | null;
        /** name */
        name: string | null;
        /** inplace editable name */
        nameeditable: string | null;
        /** addfieldmenu */
        addfieldmenu: string | null;
        fields?: Array<{
            /** name */
            name: string | null;
            /** shortname */
            shortname: string | null;
            /** type */
            type: string | null;
            /** id */
            id: number | null;
        }>;
    }>;
}

export type CoreCustomfieldReloadTemplateReturn = CoreCustomfieldReloadTemplateReturns;
export type core_customfield_reload_template_returns = CoreCustomfieldReloadTemplateReturns;
