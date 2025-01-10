import { Request, Response, NextFunction } from 'express';

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // Execute the async function and catch any errors
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncHandler;
