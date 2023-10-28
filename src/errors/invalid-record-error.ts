/**
 * Error thrown when a record is not found in the database
 * @param debugInfo Debug info
 * @returns Returns an error with the debug info
 * @example
 * ```typescript
 * throw new InvalidRecord("No record of that function found in moodle database");
 * ```
 */
export class InvalidRecord extends Error {
    readonly status: number;
    readonly debugInfo?: string;
    constructor(debugInfo?: string) {
        super();
        this.name = "invalidRecord";
        this.message = "No record of that function found in moodle database";
        this.status = 404;
        if (debugInfo) this.debugInfo = debugInfo;
    }
}