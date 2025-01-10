

import { Request, Response, NextFunction } from "express";
import projectService from "../service/project.service";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiresponse";
import mongoose from "mongoose";

class ProjectController {
    //only manager create project
    addProject = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const { _id: managerId } = req?.user;
        await projectService.addProject({ ...req.body, managerId });
        res.status(200).json(new ApiResponse(201, "Project created succesfully!"));
    });


}


export default new ProjectController();