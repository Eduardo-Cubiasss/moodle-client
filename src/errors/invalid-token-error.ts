export class InvalidToken extends Error {
    readonly status: number;
    readonly debugInfo?: string;
    constructor(debugInfo?: string) {
        super();
        this.name = "invalidToken";
        this.message = "Invalid token - token not found";
        this.status = 401;
        if (debugInfo) this.debugInfo = debugInfo;
    }
}