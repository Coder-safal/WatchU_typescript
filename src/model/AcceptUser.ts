import mongoose, { Schema } from "mongoose";



export interface IAcceptUser extends Document {
    email: string;
    organizationId: mongoose.Types.ObjectId;
    role: string;
}

const acceptuserSchema = new Schema<IAcceptUser>(
    {
        email: {
            type: String,
            required: true,
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        role: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);


const AcceptUser = mongoose.model<IAcceptUser>('AcceptUser', acceptuserSchema);
export default AcceptUser;