import mongoose, { Schema, Document } from "mongoose";

export interface IScreenshoot extends Document {
    timestampId: mongoose.Types.ObjectId;
    employeId: mongoose.Types.ObjectId;
    images: string[],
    isBlurred: boolean,

}

const screenshotSchema = new Schema(
    {
        timestampId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Timesheet",
            required: true,
        },
        employeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        images: [{ type: String }],
        isBlurred: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const Screenshot = mongoose.model("Screenshot", screenshotSchema);

export default Screenshot;