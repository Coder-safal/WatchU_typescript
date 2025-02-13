import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import departmentService from "../service/department.service";
import { ApiResponse } from "../utils/apiresponse";
import mongoose from "mongoose";
import { IUser } from "../model/User";

// interface AddEmployeeParams {
//     departmentId: string;
//     userId: string;
// }

class DepartmentController {
    // Create a new department
    createDepartment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { organizationId } = req?.user;

        const { name, description }: { name: string, description: string } = req.body;

        await departmentService.createDepartment({ name, description, organizationId });

        res.status(201).json(new ApiResponse(201, "Department created successfully!"));
    });

    // Add an employee to a department
    addEmploye = asyncHandler(async (req: Request, res: Response, _: NextFunction): Promise<void> => {
        const { departmentId, userId } = req.params;

        // Convert strings to ObjectId
        const departmentObjectId = new mongoose.Types.ObjectId(departmentId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        await departmentService.addEmployee({ departmentId: departmentObjectId, userId: userObjectId });

        res.status(200).json(new ApiResponse(200, "User added to department successfully!"));
    });

    getAllDepartmentEmployee = asyncHandler(async (req: Request, res: Response, _: NextFunction): Promise<void> => {

        const departmentId = new mongoose.Types.ObjectId(req.params?.departmentId)

        const allEmploye = await departmentService.getAllDepartmentEmployee(departmentId);

        res.status(200).json(new ApiResponse(200, "Department Employees are fetch succesfully!", allEmploye));

    });
}

export default new DepartmentController();
