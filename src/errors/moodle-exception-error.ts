/**
 * MoodleExceptionError
 * @description
 * This error is thrown when there is an error in the Moodle server
 * @param status Status code
 * @param message Error message
 * @param debugInfo Debug info
 * @returns Returns an error with the debug info
 * @example
 * ```typescript
 * throw new MoodleException(500, "There is an error in the Moodle server");
 * ```
 */
export class MoodleException extends Error {
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