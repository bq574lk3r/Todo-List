export default class ResponseError {
    code: number;
    errors: Object | Array<any>;

    constructor(code: number, details?: Array<any> | string) {

        this.code = code;

        const _: { msg?: string } | Array<any> = this.errors = {}

        let message;
        if (Array.isArray(details)) {
            this.errors = details
            return this
        } else {
            message ??= details
        }

        if (message) {
            _.msg = message;
            return this
        };

        switch (code) {
            case 400:
                _.msg = 'Bad Request';
                break;
            case 401:
                _.msg = 'Unauthorized';
                break;
            case 404:
                _.msg = 'not found';
                break;
            case 500:
                _.msg = 'Internal Server Error';
                break;
        }
    }

};