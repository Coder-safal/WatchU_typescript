import mongoose from "mongoose";

export interface IDepartment extends Document {
    name: String,
    organizationId: mongoose.Schema.Types.ObjectId,
    managerId: mongoose.Schema.Types.ObjectId,

}

const departmentSchema = new mongoose.Schema<IDepartment>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            tirm: true,
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);


const Deparment = mongoose.model<IDepartment>('Department', departmentSchema);

export default Deparment;