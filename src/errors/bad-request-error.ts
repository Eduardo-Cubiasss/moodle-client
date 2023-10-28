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