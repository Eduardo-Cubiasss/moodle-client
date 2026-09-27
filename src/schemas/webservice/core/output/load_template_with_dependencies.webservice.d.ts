/** Load a template and its dependencies for a renderable */
export interface CoreOutputLoadTemplateWithDependenciesParams {
    /** component containing the template */
    component: string | null;
    /** name of the template */
    template: string | null;
    /** The current theme. */
    themename: string | null;
    /** Include comments or not */
    includecomments?: boolean | null;
    /** lang */
    lang?: string | null;
}

export interface CoreOutputLoadTemplateWithDependenciesReturns {
    templates: Array<{
        /** component containing the resource */
        component: string | null;
        /** name of the resource */
        name: string | null;
        /** resource value */
        value: string | null;
    }>;
    strings: Array<{
        /** component containing the resource */
        component: string | null;
        /** name of the resource */
        name: string | null;
        /** resource value */
        value: string | null;
    }>;
}

export type CoreOutputLoadTemplateWithDependenciesReturn = CoreOutputLoadTemplateWithDependenciesReturns;
export type core_output_load_template_with_dependencies_returns = CoreOutputLoadTemplateWithDependenciesReturns;
