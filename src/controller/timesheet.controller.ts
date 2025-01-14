import { NextFunction, Request, Response } from "express";
import timesheetService from "../service/timesheet.service";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiresponse";
import mongoose from "mongoose";
import { IUser } from "../model/User";

class TimesheetController {

    /* start = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        const { _id: employeeId, projectId } = req?.user as IUser;
        const employeeObjectId = new mongoose.Types.ObjectId(employeeId as string);
        // const projectObjectId = new mongoose.Types.ObjectId(projectId as string);


        await timesheetService.start({ employeeId: employeeObjectId, projectId: projectObjectId })

        res.status(200).json(new ApiResponse(200, "Time start succesfully!"))
    }) */

    stop = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        res.status(200).json(new ApiResponse(200, "Session stop succesfully!"))
    })


    resume = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        res.status(200).json(new ApiResponse(200, "Session stop succesfully!"))
    })


    paulse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        res.status(200).json(new ApiResponse(200, "Session stop succesfully!"))
    })




}



export default new TimesheetController();