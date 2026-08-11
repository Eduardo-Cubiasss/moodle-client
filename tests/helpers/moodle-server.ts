import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

/**
 * What the stub saw arrive, so a test can assert on the wire format rather
 * than on the client's internals.
 */
export interface CapturedRequest {
    method: string;
    path: string;
    query: URLSearchParams;
    body: string;
    headers: NodeJS.Dict<string | string[]>;
}

/** What the stub should answer with on the next call. */
export interface MoodleStubReply {
    status?: number;
    body?: unknown;
    contentType?: string;
}

export interface MoodleStub {
    /** Points at a subpath, the way a real Moodle install usually does. */
    rootURL: string;
    requests: CapturedRequest[];
    lastRequest(): CapturedRequest;
    reply(next: MoodleStubReply): void;
    close(): Promise<void>;
}

/**
 * A throwaway HTTP server standing in for Moodle's REST endpoint.
 *
 * The integration tests talk to this over a real socket instead of stubbing
 * `fetch`: the things worth checking here — where the parameters end up for
 * each method, how the body gets encoded, which content type goes out — only
 * exist once the request has actually been serialised.
 */
export const startMoodleStub = async (): Promise<MoodleStub> => {
    let nextReply: MoodleStubReply = {};
    const requests: CapturedRequest[] = [];

    const server = createServer((req, res) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", () => {
            const url = new URL(req.url ?? "/", "http://127.0.0.1");

            requests.push({
                method: req.method ?? "",
                path: url.pathname,
                query: url.searchParams,
                body: Buffer.concat(chunks).toString("utf8"),
                headers: req.headers,
            });

            const { status = 200, body = [], contentType = "application/json" } = nextReply;
            const payload = typeof body === "string" ? body : JSON.stringify(body);

            res.writeHead(status, { "content-type": contentType });
            res.end(payload);
        });
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;

    return {
        rootURL: `http://127.0.0.1:${port}/moodle`,
        requests,
        lastRequest(): CapturedRequest {
            const last = requests.at(-1);
            if (!last) throw new Error("the stub received no request");
            return last;
        },
        reply(next: MoodleStubReply): void {
            nextReply = next;
        },
        close(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                server.close((err) => (err ? reject(err) : resolve()));
            });
        },
    };
};
