/** Return branches for the context tree */
export interface ToolDataprivacyTreeExtraBranchesParams {
    /** The context id to expand */
    contextid: number | null;
    /** The element we are interested on */
    element: string | null;
}

export interface ToolDataprivacyTreeExtraBranchesReturns {
    branches: Array<{
        /** The node text */
        text: string | null;
        /** The contextid this node expands */
        expandcontextid: number | null;
        /** What element is this node expanded to */
        expandelement: string | null;
        /** The node contextid */
        contextid: number | null;
        /** The node contextlevel */
        contextlevel: number | null;
        /** Is it expanded */
        expanded: number | null;
        /** Children node structure */
        branches?: Array<{
            /** The node text */
            text: string | null;
            /** The contextid this node expands */
            expandcontextid: number | null;
            /** What element is this node expanded to */
            expandelement: string | null;
            /** The node contextid */
            contextid: number | null;
            /** The node contextlevel */
            contextlevel: number | null;
            /** Is it expanded */
            expanded: number | null;
            branches: string | null[];
        }>;
    }>;
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

export type ToolDataprivacyTreeExtraBranchesReturn = ToolDataprivacyTreeExtraBranchesReturns;
export type tool_dataprivacy_tree_extra_branches_returns = ToolDataprivacyTreeExtraBranchesReturns;
