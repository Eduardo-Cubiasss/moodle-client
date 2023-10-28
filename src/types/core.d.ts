import { Method } from "axios";

export interface IURLRequest {
    rootURL: string;
    token: string;
    webServiceFunction: string;
}
export interface IDataRequest {
    urlRequest: IURLRequest;
    content: Object;
    method?: Method;
}
