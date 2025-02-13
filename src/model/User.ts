import mongoose, { Schema, Document } from "mongoose";
import CONSTANT from "../config/constant";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

// Define the IUser interface, extending mongoose.Document
export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    organizationId: mongoose.Types.ObjectId;
    isEmailVerified: boolean;
    role: string;
    hourlyRate: number;
    isActive: Boolean;
    projectId: mongoose.Types.ObjectId;
    departmentId: mongoose.Types.ObjectId;
    comparePassword(password: string): Promise<boolean>;
    generateAuthToken(): string;
    generateRefreshToken(): string;
    generateResetToken(): string;
}

const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,  // Corrected `toLowerCase` to `lowercase`
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: Object.values(CONSTANT.ROLES),
            default: 'admin',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        hourlyRate: {
            type: Number,
            default: 0,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null,
        },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null,
        }

    },
    { timestamps: true }
);

// Pre-save hook to hash the password before saving the user
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcryptjs.hash(this.password, 12);
    next();
});

// Methods for the User schema
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function (): string {

    if (this.role !== 'admin') {
        return jwt.sign(
            {
                _id: this._id,
                organizationId: this.organizationId,
                role: this.role,
                projectId: this?.projectId,
                departmentId: this?.departmentId,

            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        )
    }
    return jwt.sign(
        {
            _id: this._id,
            organizationId: this.organizationId,
            role: this.role,

        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};

userSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        }
    );
};

userSchema.methods.generateResetToken = function (): string {
    const resetToken = crypto.randomBytes(32).toString("hex").slice(0, 6);
    return resetToken;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
// export = IUser;
