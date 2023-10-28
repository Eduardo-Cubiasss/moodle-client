/**
 * Bad request error
 * @description This error is thrown when the request is bad
 * @param debugInfo Debug info
 * @returns Returns an error with the debug info
 * @example
 * ```typescript
 * throw new BadRequestError("The request is bad");
 * ```
 */
export class BadRequestError extends Error {
    public readonly status: number;
    public debugInfo?: string;
    constructor(debugInfo?: string) {
        super();
        this.name = "badRequest";
        this.message = "Bad request";
        this.status = 400;
        if (debugInfo) this.debugInfo = debugInfo;
    }
}