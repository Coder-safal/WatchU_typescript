import { NextFunction, Response, Request } from "express";
import { ApiResponse } from "../utils/apiresponse";
import asyncHandler from "../utils/asyncHandler";
import userService from "../service/user.service";
import mongoose from "mongoose";


class UserController {

    getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        const result = await userService.userFindById(req.user?._id as mongoose.Schema.Types.ObjectId);
        res.status(200).json(new ApiResponse(200, "User details fetch succesfully!", result));

    });

    updatePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        await userService.updatePassword({ ...req.body });

        res.status(200).json(new ApiResponse(200, "Password update succesfully"));

    });


    updateUserByAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = new mongoose.Types.ObjectId(req.params.userId);
        await userService.updateUserByAdmin(userId, { ...req.body });

        res.status(200).json(new ApiResponse(200, "User update succesfully"));
    });

    invite = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await userService.invite({ ...req.body });

        res.status(200).json(new ApiResponse(200, "Invite user succesfully!"));
    })


}


export default new UserController();