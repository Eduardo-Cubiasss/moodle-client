import readline from "node:readline";

/**
 * Sanitizes Git error messages by redacting sensitive tokens or credentials.
 */
export function sanitizeGitError(errorMsg: string, secret?: string): string {
    let sanitized = errorMsg;
    if (secret && secret.length > 0) {
        sanitized = sanitized.replaceAll(secret, "[REDACTED]");
    }
    // Also sanitize any embedded http(s) user:pass@ patterns
    sanitized = sanitized.replace(/(https?:\/\/)[^@\s]+@/g, "$1[REDACTED]@");
    return sanitized;
}

/**
 * Prompts the user in the console for an in-memory token/password without persisting it.
 */
export function promptForToken(host: string): Promise<string> {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(`[moodle-client] Enter Personal Access Token (or password) for '${host}': `, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}
