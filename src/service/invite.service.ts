import mongoose from "mongoose";
import User, { IUser } from '../model/User';
import ApiError from "../utils/apiError";
import Deparment, { IDepartment } from '../model/Department';
import Organization, { IOrganization } from "../model/Organization";
import Invite, { IInvite } from "../model/Invite";
import timesheetController from "../controller/timesheet.controller";
import emailconfig from "../config/email";
import jwt from 'jsonwebtoken';
import AcceptUser, { IAcceptUser } from "../model/AcceptUser";


class InviteService {

    invite = async ({ inviteBy, organizationId, email, role }: {
        inviteBy: mongoose.Types.ObjectId;
        organizationId: mongoose.Types.ObjectId;
        email: string;
        role: string;
    }): Promise<void> => {
        try {

            const user: IUser | null = await User.findOne({ email });
            if (user) {
                throw new ApiError(409, "Users already exists");
            }
            const organization: IOrganization | null = await Organization.findById(organizationId);

            if (!organization) {
                throw new ApiError(404, "Organization isn't found!");
            }

            const expiryTime: number = this.daysToMilliseconds(3); //expiryTime 3 days

            const invite: IInvite = new Invite({
                inviteBy,
                organizationId,
                email,
                role,
                expiryAt: expiryTime,
            });

            const token: string = invite.inviteToken();
            invite.token = token;

            await invite.save();

            await emailconfig.sendEmail({
                to: email as string,
                subject: "Invitation",
                template: 'invite-user',
                data: {
                    expiryIn: expiryTime,
                    currYear: new Date().getFullYear(),
                    companyName: organization.name,
                    token: `${process.env.BACKEND_URL}/${token}`
                }
            });
            return;
        } catch (error) {
            throw error;
        }

    }

    accept_invite = async (token: string): Promise<void> => {

        try {
            const invite: IInvite | null = await this.verifyToken(token);
            await AcceptUser.create({
                role: invite.role,
                organizationId: invite.organizationId,
                email: invite.email,
            });
            return;
        } catch (error) {
            throw error;
        }

    }

    register_user = async ({ fullName, email, password }: { fullName: string, email: string, password: string }) => {
        try {

            let user: IUser | null;
            user = await User.findOne({ email });
            if (user) {
                throw new ApiError(409, "Already users exists!");
            }
            const acceptUser: IAcceptUser | null = await AcceptUser.findOneAndDelete({ email });

            if (!acceptUser) {
                throw new ApiError(404, "You are not valid users!");
            }

            user = await User.create({
                email,
                fullName,
                password,
                organizationId: acceptUser.organizationId,
                isEmailVerified: true,
                role: acceptUser.role,
            });

            if (!user) {
                throw new ApiError(500, "Error while regestering users");
            }
            return;
        } catch (error) {
            throw error;
        }
    }



    // Helper function
    private daysToMilliseconds = (days: number): number => days * 24 * 60 * 60 * 1000;

    // decoded and check token is valid or not
    private verifyToken = async (token: string): Promise<IInvite> => {

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const invite: IInvite | null = await Invite.findOne({ _id: decoded?._id, token });
            if (!invite) {
                throw new ApiError(400, "Token is expiery or Invalid token");
            }
            return invite;
        } catch (error) {

        }


    }



}


export default new InviteService();