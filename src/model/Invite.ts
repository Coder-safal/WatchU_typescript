import mongoose, { Schema, Document } from "mongoose";
import jwt from 'jsonwebtoken';

export interface IInvite extends Document {
    inviteBy: mongoose.Types.ObjectId;
    organizationId: mongoose.Types.ObjectId;
    email: string;
    role: string;
    token: string;
    /*  managerId: mongoose.Types.ObjectId;
     departmentId: mongoose.Types.ObjectId; */
    expiryAt: Date;
    inviteToken(): string;
}

const inviteSchema = new Schema<IInvite>(
    {
        inviteBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['manager', 'employee'],
            required: true,
        },
        /*         departmentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Department",
                    default: null,
                },
                managerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    default: null,
                }, */
        token: {
            type: String,
        },
        expiryAt: {
            type: Date,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

inviteSchema.index({ expiryAt: 1 }, { expireAfterSeconds: 0 });


inviteSchema.methods = {
    inviteToken: function () {
        return jwt.sign(
            {
                _id: this?._id,
                role: this?.role,
                email: this?.email,

            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.INVITE_EXPIRES_IN as string,
            }
        )
    }
}

const Invite = mongoose.model<IInvite>('Invite', inviteSchema);

export default Invite;