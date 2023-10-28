/**
 * Error thrown when a parameter is invalid
 * @param debugInfo Debug info
 * @returns Returns an error with the debug info
 * @example
 * ```typescript
 * throw new InvalidParameter("The parameter is invalid");
 * ```
 */
export class InvalidParameter extends Error {
    readonly status: number;
    readonly debugInfo?: string;
    constructor(debugInfo?: string) {
        super();
        this.name = "invalidParameter";
        this.message = "Invalid parameter value";
        this.status = 400;
        if (debugInfo) this.debugInfo = debugInfo;
    }
}