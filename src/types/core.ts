/**
 * HTTP methods accepted by the client.
 *
 * Moodle's REST server only really honours GET and POST, but the previous
 * axios-based signature accepted any method, so the surface is kept open.
 */
export type HttpMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | "HEAD"
    | "OPTIONS";

/**
 * @interface IMoodleClientOptions
 * @description What a {@link MoodleClient} is built with: everything that
 * stays the same across the calls it makes.
 * @param {string} rootURL - The site's base URL
 * @param {string} token - A Moodle web service token
 * @param {HttpMethod} method - Default method for every call, POST when omitted
 */
export interface IMoodleClientOptions {
    rootURL: string;
    token: string;
    method?: HttpMethod;
}

/**
 * @interface IURLRequest
 * @description Interface for the request object
 * @param {string} rootURL - The root URL
 * @param {string} token - The token
 * @param {string} webServiceFunction - The web service function
 */
export interface IURLRequest {
    rootURL: string;
    token: string;
    webServiceFunction: string;
}

/**
 * @interface IDataRequest
 * @description Interface for the data request object
 * @param {IURLRequest} urlRequest - The request object
 * @param {object} content - The content object
 * @param {HttpMethod} method - The HTTP method, POST when omitted
 */
export interface IDataRequest {
    urlRequest: IURLRequest;
    content: object;
    method?: HttpMethod;
}

/**
 * @interface IMoodleResponse
 * @description What a successful call resolves to.
 *
 * The shape mirrors the part of the old axios response consumers actually
 * touched, so `response.data` keeps working. `data` defaults to `any`
 * because that is what axios typed it as; pass a type argument to
 * `moodleClient<T>()` to get a checked body instead.
 */
export interface IMoodleResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    ok: boolean;
    headers: Headers;
}

/**
 * @interface IMoodleErrorBody
 * @description The JSON body Moodle returns when a web service call fails.
 */
export interface IMoodleErrorBody {
    errorcode: string;
    exception?: string;
    message?: string;
    debuginfo?: string;
}
