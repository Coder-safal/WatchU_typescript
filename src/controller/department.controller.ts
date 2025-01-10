import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import departmentService from '../service/department.service';
import { ApiResponse } from "../utils/apiresponse";

class DepartmentController {

    createDepartment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        await departmentService.createDepartment({ ...req?.body });

        res.status(200).json(new ApiResponse(201, `Department create succesfully!`));
    });

}

export default new DepartmentController();