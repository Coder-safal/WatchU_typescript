
import mongoose from "mongoose";
import Project, { IProject } from "../model/Project"
import User, { IUser } from "../model/User";

class ProjectService {

    addProject = async ({ managerId, departmentId, projectName, description, startDate, endDate }): Promise<void> => {
        try {
            /* let project: IProject = */
            await Project.create({
                name: projectName,
                description,
                startDate,
                endDate,
                managerId,
                departmentId
            });

        } catch (error) {
            throw error;

        }
    }

    getAllProjectEmployee = async ({ projectId, departmentId }: { projectId: mongoose.Types.ObjectId, departmentId: mongoose.Types.ObjectId }): Promise<any> => {
        try {

            const allEmployee = await User.find({ projectId, departmentId }).select("-password -isEmailVerified -hourlyRate");

            return allEmployee;
        } catch (error: any) {
            throw error;
        }
    }

    getMyproject = async ({ userId, projectId }): Promise<any> => {
        const user = (await User.findById(userId)).populate('projectId');

        return user;
    }

}


export default new ProjectService();