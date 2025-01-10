import mongoose, { Schema, Document } from "mongoose";

export interface IPayroll extends Document {
    employeId: mongoose.Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    isPaid: boolean;
    horulyRate: number;
    metrics: {
        totalHour: number;
        deductions: number;
        overTimeAmounts: number;
        totalAmount: number;

    }
}

const payrollSchema = new Schema<IPayroll>(
    {

        employeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        horulyRate: {
            type: Number,
            default: 0,
        },
        metrics: {
            totalHour: { type: Number, default: 0 },
            deductions: { type: Number, default: 0 },
            overTimeAmounts: { type: Number, default: 0 },
            totalAmount: { type: Number, default: 0 },
        }
    },
    {
        timestamps: true,
    }
);


const Payroll = mongoose.model<IPayroll>("Payroll", payrollSchema);


export default Payroll;