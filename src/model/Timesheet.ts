import mongoose, { Schema, Document } from "mongoose";

export interface ITimesheet extends Document {

    employeeId: mongoose.Schema.Types.ObjectId;
    startTime: Number;
    endTime: Number;
    duration: Number;
    projectId: mongoose.Schema.Types.ObjectId;
    isRunning: boolean;
}


const timesheetSchema = new Schema<ITimesheet>(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startTime: {
            type: Number,
            default: () => Math.floor(Date.now() / 1000), //convert milleseconds into seccond
        },
        endTime: {
            type: Number,
            default: () => Math.floor(Date.now() / 1000),//convet milleseconds into second
        },
        duration: {
            type: Number, //endTime-startTime
            default: 0,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        isRunning: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const Timesheet = mongoose.model<ITimesheet>("Timesheet", timesheetSchema);

export default Timesheet;
