import mongoose from "mongoose";
import crypto from "crypto";

export interface ITokenEmail extends Document {
    userId: mongoose.Schema.Types.ObjectId,
    token: string,
    expiryAt: Date,

};

const tokenEmail = new mongoose.Schema<ITokenEmail>(
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

tokenEmail.index({ expiryAt: 1 }, { expireAfterSeconds: 0 });

tokenEmail.pre("save", async function (next) {
    if (!this.isModified('token')) {
        return next();
    }
    this.token = crypto.createHash('sha256').update(this.token).digest('hex');
    next();
})



const TokenEmail = mongoose.model<ITokenEmail>("TokenEmail", tokenEmail);
export default TokenEmail;