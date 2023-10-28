/**
 * Error thrown when a URL is not found
 * @param debugInfo Debug info
 * @returns Returns an error with the debug info
 * @example
 * ```typescript
 * throw new URLError("The URL is invalid");
 * ```
 */
export class URLError extends Error {
    readonly status: number;
    constructor() {
        super(...arguments);
        this.name = "urlError";
        this.message = "URL not found";
        this.status = 404;
    }
}