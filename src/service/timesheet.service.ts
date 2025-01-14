import mongoose from "mongoose";
import ApiError from "../utils/apiError";
import Timesheet, { ITimesheet } from "../model/Timesheet";

class TimesheetService {

    start = async ({ employeeId, projectId }: { employeeId: mongoose.Types.ObjectId, projectId: mongoose.Types.ObjectId }): Promise<string> => {
        try {
            let timesheet: ITimesheet | null;

            timesheet = await Timesheet.findOne({ employeeId, isRunning: true });
            if (timesheet) {
                throw new ApiError(409, "Already time start!");
            }

            timesheet = await Timesheet.create({
                employeeId,
                projectId,
                isRunning: true,
            });

            return timesheet?._id as string;
        } catch (error) {
            throw error;
        }

    }

    stop = async (timeId: mongoose.Types.ObjectId, employeeId: mongoose.Types.ObjectId): Promise<void> => {
        try {
            let timesheet: ITimesheet | null = await Timesheet.findOneAndUpdate(
                { _id: timeId, isRunning: true, employeeId },
                {
                    $set: {
                        isRunning: false,
                        endTime: Math.floor(Date.now() / 1000),
                    }
                },
                { new: true }
            );

            if (timesheet) {
                throw new ApiError(400, "Time isn't started!");
            }

            await timesheet.updateTimesheet()

            return;
        } catch (error) {
            throw error;
        }


    }

    resume = async (timesheetId: mongoose.Types.ObjectId,employeeId: mongoose.Types.ObjectId): Promise<void> => {

        try {
            const timesheet: ITimesheet | null = await Timesheet.findOne({ _id: timesheetId, isRunning: false });
            if (!timesheet) throw new Error("Timesheet not found");

            // Calculate the start and end of today
            const startOfDay = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000); // Midnight today (in seconds)
            const endOfDay = Math.floor(new Date().setHours(23, 59, 59, 999) / 1000); // End of today (in seconds)

            // Check if the timesheet is from today
            const isToday = timesheet.startTime >= startOfDay && timesheet.startTime <= endOfDay;

            if (!isToday) {
                throw new Error("This timesheet is not from today and cannot be resumed.");
            }

            timesheet.isRunning = true;
            await timesheet.save();

            return;
        } catch (error) {
            throw error;
        }

    }

    pauseTime = async (timesheetId: mongoose.Types.ObjectId, employeeId: mongoose.Types.ObjectId): Promise<void> => {
        try {
            let timesheet: ITimesheet | null;

            timesheet = await Timesheet.findOneAndUpdate({ timesheetId, isRunning: true, employeeId },
                { $set: { isRunning: false } });
            if (!timesheet) {
                throw new ApiError(400, "Time isn't started!");
            }

            return;
        } catch (error) {
            throw error;
        }
    }




}


export default new TimesheetService();