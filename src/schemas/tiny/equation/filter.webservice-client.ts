/** Filter the equation */
export interface TinyEquationFilterParams {
    /** The context ID */
    contextid: number | null;
    /** The equation content */
    content: string | null;
    /** Whether to strip HTML tags */
    striptags?: boolean | null;
}

export interface TinyEquationFilterReturns {
    /** Filtered content */
    content: string | null;
}

export type TinyEquationFilterReturn = TinyEquationFilterReturns;
export type tiny_equation_filter_returns = TinyEquationFilterReturns;
