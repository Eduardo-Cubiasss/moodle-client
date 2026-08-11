export { MoodleClient, moodleClient } from "./client/moodle-client";
export { MoodleResponse } from "./client/moodle-response";

export type {
    HttpMethod,
    IDataRequest,
    IMoodleClientOptions,
    IMoodleErrorBody,
    IMoodleResponse,
    IURLRequest,
} from "./types/core";

export { AccessException } from "./errors/access-exception-error";
export { BadRequestError } from "./errors/bad-request-error";
export { InvalidParameter } from "./errors/invalid-parameter-error";
export { InvalidRecord } from "./errors/invalid-record-error";
export { InvalidToken } from "./errors/invalid-token-error";
export { MoodleException } from "./errors/moodle-exception-error";
export { URLError } from "./errors/url-error";
