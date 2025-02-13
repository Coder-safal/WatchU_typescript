import mongoose from "mongoose";
import Project, { IProject } from "../model/Project";
import User, { IUser } from "../model/User";
import ApiError from "../utils/apiError";
import timeUtils from "../utils/TimeUtils";

class ProjectService {
  addProject = async ({
    managerId,
    departmentId,
    projectName,
    description,
    startDate,
    endDate,
  }): Promise<void> => {
    try {
      /* let project: IProject = */

      const project: IProject = await Project.findOne({ name: projectName });
      if (project) {
        throw new ApiError(409, "Already Project exist");
      }

      await Project.create({
        name: projectName,
        description,
        startDate: timeUtils.parseDate(startDate),
        endDate: timeUtils.parseDate(endDate),
        managerId,
        departmentId,
      });
    } catch (error) {
      throw error;
    }
  };

  addEmployee = async ({ employeeId, projectId }) => {
    const project: IProject | null = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project isn't found!");
    }

    const user: IUser | null = await User.findOneAndUpdate(
      { _id: employeeId, role: "employee" },
      {
        $set: {
          projectId,
        },
      }
    );

    if (!user) {
      throw new ApiError(400, "Unable to add users");
    }
    return;
  };

  getAllProjectEmployee = async ({
    projectId,
    departmentId,
  }: {
    projectId: mongoose.Types.ObjectId;
    departmentId: mongoose.Types.ObjectId;
  }): Promise<any> => {
    try {
      const allEmployee = await User.find({ projectId, departmentId }).select(
        "-password -isEmailVerified -hourlyRate"
      );

      return allEmployee;
    } catch (error: any) {
      throw error;
    }
  };

  getMyproject = async (userId): Promise<any> => {
    const user = (await User.findById(userId)).populate("projectId");

    return user;
  };
}

export default new ProjectService();
