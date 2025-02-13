import { NextFunction, Request, Response } from "express";
import timesheetService from "../service/timesheet.service";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiresponse";
import mongoose from "mongoose";
import { IUser } from "../model/User";

class TimesheetController {
  start = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // const { _id: employeeId, projectId } = req?.user;
      const { _id: employeeId } = req?.user;
      const employeeObjectId = new mongoose.Types.ObjectId(
        employeeId as string
      );
      const { projectId } = req.params;

      const projectObjectId = new mongoose.Types.ObjectId(projectId);

      const result = await timesheetService.start({
        employeeId: employeeObjectId,
        projectId: projectObjectId,
      });

      res
        .status(200)
        .json(
          new ApiResponse(200, "Time start succesfully!", { timeId: result })
        );
    }
  );

  stop = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { timeId } = req.params;
      const { _id } = req?.user;
      const employeeId = new mongoose.Types.ObjectId(_id as string);
      const timeObjId = new mongoose.Types.ObjectId(timeId as string);

      await timesheetService.stop(timeObjId, employeeId);

      res.status(200).json(new ApiResponse(200, "Session stop succesfully!"));
    }
  );

  resume = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { timeId } = req.params;
      const { _id } = req?.user;
      const employeeId = new mongoose.Types.ObjectId(_id as string);
      const timeObjId = new mongoose.Types.ObjectId(timeId as string);

      await timesheetService.resume(timeObjId, employeeId);

      res.status(200).json(new ApiResponse(200, "Session resume succesfully!"));
    }
  );

  pause = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { timeId } = req.params;
      const { _id } = req?.user;
      const employeeId = new mongoose.Types.ObjectId(_id as string);
      const timeObjId = new mongoose.Types.ObjectId(timeId as string);

      await timesheetService.pauseTime(timeObjId, employeeId);

      res.status(200).json(new ApiResponse(200, "Session pause succesfully!"));
    }
  );
}

export default new TimesheetController();
