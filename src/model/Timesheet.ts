import mongoose, { Schema, Document } from "mongoose";

export interface ITimesheet extends Document {
  employeeId: mongoose.Types.ObjectId;
  startTime: number;
  endTime: number;
  duration: number;
  projectId: mongoose.Types.ObjectId;
  isRunning: boolean;
  updateTimesheet(): Promise<void>;
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
      default: null,
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
    },
  },
  {
    timestamps: true,
  }
);

timesheetSchema.methods = {
  updateTimesheet: async function (): Promise<void> {
    // if (!this.endTime) {
    this.endTime = Math.floor(Date.now() / 1000);
    // }

    this.duration += this.endTime - this.startTime;
    console.log("Duration is: ", this.duration);
    this.isRunning = false;

    await this.save();

    return;
  },
};

const Timesheet = mongoose.model<ITimesheet>("Timesheet", timesheetSchema);
export default Timesheet;
