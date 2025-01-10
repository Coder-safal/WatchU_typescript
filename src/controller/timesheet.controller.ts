import { NextFunction, Request, Response } from "express";
import timesheetService from "../service/timesheet.service";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiresponse";

class TimesheetController {

    start = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        res.status(200).json(new ApiResponse(200, "Session start succesfully!"))
    })

    stop = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        res.status(200).json(new ApiResponse(200, "Session stop succesfully!"))
    })

    updateTimesheet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        res.status(200).json(new ApiResponse(200, "Session update succesfully!"))
    })


}



export default new TimesheetController();