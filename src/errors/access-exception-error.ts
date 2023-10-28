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