/** moves element up/down */
export interface ToolXmldbInvokeMoveActionParams {
    /** Action */
    action: string | null;
    /** Plugin that is being edited */
    dir: string | null;
    /** Table name */
    table: string | null;
    /** Field name */
    field?: string | null;
    /** Key name */
    key?: string | null;
    /** Index name */
    index?: string | null;
    /** How many positions to move by (negative - up, positive - down) */
    position: number | null;
}

export type ToolXmldbInvokeMoveActionReturns = unknown;

export type ToolXmldbInvokeMoveActionReturn = ToolXmldbInvokeMoveActionReturns;
export type tool_xmldb_invoke_move_action_returns = ToolXmldbInvokeMoveActionReturns;
