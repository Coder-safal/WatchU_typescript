import mongoose from "mongoose";

export interface IDepartment extends Document {
  name: string;
  organizationId: mongoose.Types.ObjectId;
  managerId?: mongoose.Types.ObjectId;
  description: string;
}

const departmentSchema = new mongoose.Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Deparment = mongoose.model<IDepartment>("Department", departmentSchema);

export default Deparment;
