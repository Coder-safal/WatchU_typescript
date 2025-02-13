
// const asyncHandler = require("../utils/asynchandler.utils")
// const ApiError = require("../utils/apierror.utils");
// const jwt = require("jsonwebtoken");

import User, { IUser } from "../model/User";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";


// const User = require("../models/User");

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}


export const auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new ApiError(401, "Aunthentication required!");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded?._id);

        if (!user) { //check user status active or not
            throw new ApiError(401, "Aunthentication failed!");
        }
        req.user = user;
        next();
    } catch (error) {
        // next(new ApiError(401, "Aunthentication failed"));
        throw error;
    }
})

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req?.user.role)) {
            throw new ApiError(403, "Permission denied");
        }
        next();
    }

}

// module.exports = { auth, authorize };