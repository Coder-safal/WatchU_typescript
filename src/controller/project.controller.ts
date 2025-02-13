import { Request, Response, NextFunction } from "express";
import projectService from "../service/project.service";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiresponse";
import mongoose from "mongoose";

class ProjectController {
  //only manager create project
  create = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { _id: managerId } = req?.user;
      await projectService.addProject({
        ...req.body,
        ...req.params, //departmentId
        managerId,
      });

    //   console.log("Test add project routes!");

      res
        .status(201)
        .json(new ApiResponse(201, "Project created succesfully!"));
    }
  );

  addEmployee = asyncHandler(
    async (req: Request, res: Response, _: NextFunction): Promise<void> => {
      const { employeeId, projectId } = req.params;

      await projectService.addEmployee({ employeeId, projectId });

      res.status(200).json(new ApiResponse(200, "Employee add Succesfully"));
    }
  );

  getAllProjectEmployee = asyncHandler(
    async (req: Request, res: Response, _: NextFunction): Promise<void> => {
      const { projectId, departmentId } = req?.params;

      const projectIdObj = new mongoose.Types.ObjectId(projectId);
      const departmentIdObj = new mongoose.Types.ObjectId(departmentId);

      const result = await projectService.getAllProjectEmployee({
        projectId: projectIdObj,
        departmentId: departmentIdObj,
      });

      res
        .status(200)
        .json(new ApiResponse(200, "All Employee fetch succesfully!", result));
    }
  );

  // getMyproject = asyncHandler(async () => {

  // })
}

export default new ProjectController();
