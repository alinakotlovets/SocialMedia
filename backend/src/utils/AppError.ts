export class AppError extends Error {
    statusCode: number;
    errorsText: string[];
    constructor(statusCode = 500, errorsText: string | string[]) {
        super();
        this.statusCode = statusCode;
        this.errorsText = Array.isArray(errorsText) ? errorsText : [errorsText];
    }
}