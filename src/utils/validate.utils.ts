import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            status: 'fail', data: {
                message: error.array().map((err) => err.msg).join(', '),
            }
        });
    }
    next();
}

