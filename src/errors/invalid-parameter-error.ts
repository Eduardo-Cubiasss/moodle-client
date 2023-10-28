class InvalidParameter extends Error {
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