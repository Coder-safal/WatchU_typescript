import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import screenshotService from "../service/screenshot.service";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/apiresponse";

class ScreenshotController {

    uploadImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {


        let { timestamId } = req.params;
        const { _id } = req?.user;
        await screenshotService.uploadScreenshot(req.file.path, new mongoose.Types.ObjectId(timestamId), _id as mongoose.Types.ObjectId);

        res.status(200).json(new ApiResponse(200, "Screenshot upload succesfully!"));

    });

}



export default new ScreenshotController();