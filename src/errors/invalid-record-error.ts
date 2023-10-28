class InvalidRecord extends Error {
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