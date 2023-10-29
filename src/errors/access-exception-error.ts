/**
 * Access Exception Error
 * @description This error is thrown when the service does not have access to use that web services function
 * @param debugInfo Debug info
 * @returns Returns an error with the debug info
 * @example
 * ```typescript
 * throw new AccessException("The service does not have access to use that web services function");
 * ```
 */
export class AccessException extends Error {
    readonly status: number;
    readonly debugInfo?: string;
    constructor(debugInfo?: string) {
        super();
        this.name = "accessException";
        this.message = "The service does not have access to use that web services function";
        this.status = 403;
        if (debugInfo) this.debugInfo = debugInfo;
    }
}