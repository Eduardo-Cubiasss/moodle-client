import { IURLRequest } from "../types/core";
import FormData from "form-data";

export const getUrl = (dataUrl: IURLRequest) => {
    return `${dataUrl.rootURL}/webservice/rest/server.php?wstoken=${dataUrl.token}&wsfunction=${dataUrl.webServiceFunction}&moodlewsrestformat=json`;
};

export const createFormattedObject = (object: object, i = 0, keyT = "", response = {}, isFirstIteration = true): object | undefined => {
    let aux;
    for (let [key, val] of Object.entries(object)) {
        keyT.length === 0 ? (aux = keyT + `${key}`) : (aux = keyT + `[${key}]`);
        if (typeof val === "object") {
            createFormattedObject(val, i++, aux, response, false);
        } else if (typeof val !== "undefined") {
            Object.assign(response, { [`${aux}`]: val });
        }
    }
    if (isFirstIteration) return response;
};

export const formatContent = (data: object): FormData => {
    const formattedObject = createFormattedObject(data);
    const formData = new FormData();

    if (!formattedObject) return formData;

    for (let [key, val] of Object.entries(formattedObject))
        formData.append(`${key}`, `${val}`);

    return formData;
};