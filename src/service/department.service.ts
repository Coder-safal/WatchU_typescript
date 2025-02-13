import mongoose from "mongoose";
import Deparment, { IDepartment } from "../model/Department";
import ApiError from "../utils/apiError";
import User, { IUser } from "../model/User";

class DepartmentService {
  createDepartment = async ({
    name,
    description,
    organizationId,
  }: {
    name: String;
    description: String;
    organizationId: mongoose.Types.ObjectId;
  }): Promise<void> => {
    try {
      let department: IDepartment | null;

      department = await Deparment.findOne({ name: name.trim() });
      if (department) {
        throw new ApiError(409, "Department already exists!");
      }

      department = await Deparment.create({
        name,
        description,
        organizationId,
      });
      return;
    } catch (error: any) {
      throw error;
    }
  };

  addEmployee = async ({
    departmentId,
    userId,
  }: {
    departmentId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
  }): Promise<void> => {
    console.log("Department ID : ", departmentId);
    try {
      const user: IUser | null = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            departmentId,
          },
        },
        {
          new: true,
          runValidators: false,
        }
      );

      if (!user) {
        throw new ApiError(404, "User isn't found!");
      }

      console.log("Add Employee on department: ", user);
    } catch (error: any) {
      throw error;
    }
  };

  getAllDepartmentEmployee = async (
    departmentId: mongoose.Types.ObjectId
  ): Promise<any> => {
    try {
      const allEmployee = await User.find({ departmentId }).select(
        "-isEmailVerified -password -hourlyRate -projectId"
      );

      return allEmployee;
    } catch (error: any) {
      throw error;
    }
  };
}

export default new DepartmentService();
