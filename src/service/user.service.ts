import mongoose from "mongoose";
import User, { IUser } from "../model/User";
import { config } from "dotenv";
import emailconfig from "../config/email";
import ApiError from "../utils/apiError";


class UserService {

    userFindById = async (_id: mongoose.Schema.Types.ObjectId): Promise<IUser> => {

        const user: IUser | null = await User.findById(_id);

        return user.toObject();
    }


    // invite manager
    invite = async ({ role, inviteByRole, fullName, email, projectId, organizationId, hourlyRate, departmentId }): Promise<void> => {


        if (!this.allowedInvite({ role, inviteByRole })) {
            throw new ApiError(403, "Permission denied!");
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            throw new ApiError(409, "Already Users exists!");
        }

        let password: string = this.generatePassword();

        const user: IUser = await User.create({
            role,
            fullName,
            email,
            projectId,
            organizationId,
            hourlyRate,
            departmentId,
            password,
            isEmailVerified: true,
        });


        if (!user) {
            throw new ApiError(500, "Internal Errors!");
        }

        await emailconfig.sendEmail({
            to: email as string,
            subject: 'Password',
            template: 'invite-user',
            data: {
                companyName: 'Brand-Builder',
                currYear: new Date().getFullYear(),
                token: this.generatePassword(),
            }
        });

        return;

    }


    updatePassword = async ({ _id, oldPassword, newPassword }: { _id: mongoose.Types.ObjectId, oldPassword: String, newPassword: string }) => {

        if (oldPassword === newPassword) {
            throw new ApiError(409, "oldPassword and newPassword mustn't be same");
        }

        const user: IUser | null = await User.findById(_id).select("+password");

        // console.log("Password compare", await user?.comparePassword(oldPassword));
        const validPassword = await user?.comparePassword(oldPassword as string);

        if (!user || !validPassword) {
            throw new ApiError(400, "Invalid credentials!");
        }
        user.password = newPassword;

        // await user.save({ validateBeforeSave: true });
        await user.save({ validateBeforeSave: true });

        return user;
    }


    updateUserByAdmin = async (userId: mongoose.Types.ObjectId, updateData: string[]): Promise<any> => {

        console.log("UserId : ", userId, "updateData: ", updateData);

        const allowedUpdate = ['position', 'project', 'hourlyRate'];

        const updates = {};

        Object.keys(updateData).forEach((key) => {
            if (allowedUpdate.includes(key)) {
                updates[key] = updateData[key];
            }
        });

        const user: IUser | null = await User.findByIdAndUpdate(
            userId,
            updates,
            {
                new: true, runValidators: true,
            }
        );

        if (!user) {
            throw new ApiError(404, "User doesnt' exist!");
        }

        return user.toObject();
    }



    // Helper Function

    allowedInvite = ({ role, inviteByRole }) => {
        const adminAllowed = ['employee'];
        if (inviteByRole == 'admin' && adminAllowed.includes(role)) {
            return true;
        }
        return false;
    }


    getRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    generatePassword = (length: number = 12) => {
        let charset = "abcdefghijkABCDEFGHIJKLMNOPQRSTlmnopqrstuvwxyzUVWXYZ0123456789+_)(*&^%$#@!}/;'[]\"?><:{}123456789";
        let retVal = "";
        for (let i = 0; i < length; ++i) {
            retVal += charset.charAt(this.getRandomInt(0, charset.length));
        }
        return retVal;
    }



}

export default new UserService();