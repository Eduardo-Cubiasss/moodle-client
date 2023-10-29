import { Method } from "axios";

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
 * @param {Object} content - The content object
 * @param {Method} method - The method object
 */
export interface IDataRequest {
    urlRequest: IURLRequest;
    content: Object;
    method?: Method;
}
