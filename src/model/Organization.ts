import mongoose, { Document } from "mongoose";


export interface IOrganization extends Document {
    name: string,
    ownerId: mongoose.Schema.Types.ObjectId,
    status: string,
    department: string[],
    metaData: {
        employeCount: Number,
        activeUser: Number,

    }
}

const organizationSchema = new mongoose.Schema<IOrganization>(
    {
        name: {
            type: String,
            required: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: { //organization status
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active',
        },
        department: [{ type: String }],
        metaData: {
            employeCount: { type: Number, default: 0 },
            activeUser: { type: Number, default: 0 }

        }
    },
    {
        timestamps: true,
    }
);

organizationSchema.index({ ownerId: 1 });
organizationSchema.index({ status: 1 });

const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);

export default Organization;