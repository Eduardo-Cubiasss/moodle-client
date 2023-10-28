class MoodleException extends Error {
    readonly status;
    readonly debugInfo;
    constructor(status: number, message: string, debugInfo?: string) {
        super();
        this.name = "moodleException";
        this.message = message;
        this.status = status;
        if (debugInfo) this.debugInfo = debugInfo;
    }
}