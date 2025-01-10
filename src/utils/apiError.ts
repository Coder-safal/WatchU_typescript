
class ApiError extends Error {
    statusCode: number;
    errors: any[];
    stack?: string;
    constructor(statusCode: number, message: string = "Some Errors occurs!", errors: any[] = [], stack?: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;

        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }

    }

}


export default ApiError;