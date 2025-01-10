import mongoose, { Document } from "mongoose";
import crypto from "crypto";

export interface IResetToken extends Document {
    userId: mongoose.Schema.Types.ObjectId,
    token: string,
    expiryAt: Date,

};

const resetTokenSchema = new mongoose.Schema<IResetToken>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        expiryAt: {
            type: Date,
            required: true,
        }
    }
);

resetTokenSchema.index({ expiryAt: 1 }, { expireAfterSeconds: 0 });

resetTokenSchema.pre("save", async function (next) {
    if (!this.isModified('token')) {
        return next();
    }
    this.token = crypto.createHash('sha256').update(this.token).digest('hex');
    next();
})



const ResetToken = mongoose.model<IResetToken>("ResetToken", resetTokenSchema);
export default ResetToken;