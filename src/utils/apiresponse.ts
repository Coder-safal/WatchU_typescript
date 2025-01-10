
class ApiResponse<T = any> {
    success?: boolean;
    data: {
        message: string,
        user?: T | T[]
    };
    constructor(statusCode: number, message: string = "success", data?: T | T[]) {
        this.success = statusCode < 400;
        // this.statusCode = statusCode;
        this.data = {
            message
        }

        if (data && Array.isArray(data)) {
            this.data = {
                message,
                user: [...data]
            }
        }
        else if (data) {
            this.data = {
                message,
                user: { ...data }
            }
        }
    }
}

export { ApiResponse };