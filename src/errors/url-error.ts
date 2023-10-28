class URLError extends Error {
    readonly status: number;
    constructor() {
        super(...arguments);
        this.name = "urlError";
        this.message = "URL not found";
        this.status = 404;
    }
}