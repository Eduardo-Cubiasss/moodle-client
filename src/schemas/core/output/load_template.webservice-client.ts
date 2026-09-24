/** Load a template for a renderable */
export interface CoreOutputLoadTemplateParams {
    /** component containing the template */
    component: string | null;
    /** name of the template */
    template: string | null;
    /** The current theme. */
    themename: string | null;
    /** Include comments or not */
    includecomments?: boolean | null;
}

/** template */
export type CoreOutputLoadTemplateReturns = string | null;

export type CoreOutputLoadTemplateReturn = CoreOutputLoadTemplateReturns;
export type core_output_load_template_returns = CoreOutputLoadTemplateReturns;
