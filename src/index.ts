import core from "./core";

export const moodleClient = core;

export type { IDataRequest, IURLRequest } from "./types/core";

export { AccessException } from "./errors/access-exception-error";
export { BadRequestError } from "./errors/bad-request-error";
export { InvalidParameter } from "./errors/invalid-parameter-error";
export { InvalidRecord } from "./errors/invalid-record-error";
export { InvalidToken } from "./errors/invalid-token-error";
export { MoodleException } from "./errors/moodle-exception-error";
export { URLError } from "./errors/url-error";
