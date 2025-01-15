import mongoose, { Schema, Document, Model } from "mongoose";
import User from "./User";

// Define the interface for the Payroll document
export interface IPayroll extends Document {
    employeeId: mongoose.Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    isPaid: boolean;
    hourlyRate: number;
    additions?: number;
    payPeriod?: string;
    status?: string;
    processedDate?: Date;
    paidDate?: Date;
    isGeneratedInvoice: boolean;
    metrics: {
        totalHour: number;
        regularHours?: number;
        overTimeHours?: number;
        deductions: number;
        overTimeAmounts: number;
        totalAmount: number;
    };
}

// Define the interface for static methods
interface PayrollModel extends Model<IPayroll> {
    updatePayroll(employeeId: mongoose.Types.ObjectId, duration: number): Promise<void>;
    calculateMontlyPayroll(employeeId: mongoose.Types.ObjectId, endDate: Date): Promise<IPayroll>;
    calculatePayrollRange(employeeId: mongoose.Types.ObjectId, endDate?: Date): Promise<IPayroll>;
}

// Define the schema for the Payroll model
const payrollSchema = new Schema<IPayroll>(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            default: null,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        hourlyRate: {
            type: Number,
            default: 0,
        },
        additions: {
            type: Number,
            default: 0,
        },
        payPeriod: {
            type: String,
            default: "Monthly",
        },
        status: {
            type: String,
            enum: ["Pending", "Processed", "Paid"],
            default: "Pending",
        },
        processedDate: {
            type: Date,
        },
        paidDate: {
            type: Date,
        },
        isGeneratedInvoice: {
            type: Boolean,
            default: false,
        },
        metrics: {
            totalHour: { type: Number, default: 0 },
            regularHours: { type: Number, default: 7 },
            deductions: { type: Number, default: 0 },
            overTimeAmounts: { type: Number, default: 0 },
            totalAmount: { type: Number, default: 0 },
            overTimeHours: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Add methods to the schema (static methods)
payrollSchema.statics.updatePayroll = async function (employeeId: mongoose.Types.ObjectId, duration: number): Promise<void> {

    const Payroll = mongoose.model("Payroll");

    let payroll = await Payroll.findOne({ employeeId, isGeneratedInvoice: false });

    if (!payroll) {
        const user = await User.findById(employeeId);

        if (!user) {
            throw new Error("User not found");
        }

        payroll = await Payroll.create({
            employeeId,
            hourlyRate: user.hourlyRate,
        });
    }

    const totalHours = (duration / (60 * 60));  // Convert seconds to hours

    const deductions = payroll.metrics.deductions;
    let overTimeHours = (totalHours > payroll.metrics.regularHours) ? totalHours - payroll.metrics.regularHours : 0;
    const overTimeAmounts = overTimeHours * 1.2;  // Overtime is increased by 1.2
    const workHoursAmount = (totalHours - overTimeHours) * payroll.hourlyRate;

    const totalAmounts = overTimeAmounts + workHoursAmount - deductions;

    payroll.metrics.totalHour = totalHours;
    payroll.metrics.deductions = deductions;
    payroll.metrics.overTimeHours = overTimeHours;
    payroll.metrics.overTimeAmounts = overTimeAmounts;
    payroll.metrics.totalAmount = totalAmounts;

    await payroll.save();
};

payrollSchema.statics.calculateMontlyPayroll = async function (employeeId: mongoose.Types.ObjectId, endDate: Date): Promise<IPayroll> {
    // return await this.calculatePayrollRange(employeeId, endDate);
    return;
};

payrollSchema.statics.calculatePayrollRange = async function (employeeId: mongoose.Types.ObjectId, endDate?: Date): Promise<IPayroll> {

    const Payroll = mongoose.model("Payroll");

    endDate = endDate || new Date();

    const payroll: IPayroll = await Payroll.findOne({
        employeeId,
        isGeneratedInvoice: false,
    });

    if (!payroll) {
        throw new Error("Payroll isn't found");
    }

    payroll.endDate = endDate;
    payroll.isGeneratedInvoice = true;

    await payroll.save();  // Don't forget to save the updated payroll

    return payroll;
};

// Create and export the model with the PayrollModel interface
const Payroll = mongoose.model<IPayroll, PayrollModel>("Payroll", payrollSchema);

export default Payroll;
