import User, { IUser } from "../model/User";
import ApiError from "../utils/apiError";
import Organization, { IOrganization } from '../model/Organization';
import mongoose from "mongoose";
import TokenEmail from "../model/TokenEmail";
import emailconfig from "../config/email";
import logger from "../config/logger";
import crypto from 'crypto';
import { ITokenEmail } from '../model/TokenEmail';
import ResetToken, { IResetToken } from "../model/ResetToken";
import jwt from "jsonwebtoken";

interface LoginResponse {
    token: string;
    refreshToken: string;
}

class AuthService {

    public register = async ({ email, password, fullName, companyName }: { fullName: String, email: String, password: String, companyName: String }): Promise<void> => {
        try {

            let existUser: IUser | null = await User.findOne({ email });
            if (existUser) {
                throw new ApiError(409, "Already users exists");
            }
            const organization: IOrganization = await Organization.create({
                name: companyName,
            });
            let user: IUser = await User.create({
                email,
                fullName,
                password,
                organizationId: organization?._id,
            });

            if (!user) {
                throw new ApiError(500, "Error while creating users!");
            }

            organization.ownerId = user?._id as mongoose.Schema.Types.ObjectId;
            await organization.save();

            // verify Email
            const token: string = user.generateResetToken();
            const minutes = 2;

            await TokenEmail.create({
                token,
                userId: user?._id,
                expiryAt: new Date(Date.now() + minutes * 60 * 1000)
            })
            logger.info("Token saved successfully. Sending email...");

            const currYear = new Date().getFullYear();

            await emailconfig.sendEmail({
                to: email as string,
                subject: 'Verify Email',
                template: 'verify-email',
                data: {
                    expiryIn: minutes,
                    currYear,
                    companyName: 'Brand Builder',
                    token: `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`,
                }
            });
        } catch (error: any) {
            throw error;
        }
    }



    public login = async ({ email, password }: { email: String, password: String }): Promise<LoginResponse> => {

        const user: IUser | null = await User.findOne({ email }).select("+password");

        if (!user) throw new ApiError(401, "Invalid credentials!");
        if (!user?.isEmailVerified) throw new ApiError(401, "Email isn't verified, Please verify your email before proceeding");
        if (!(await user.comparePassword(password as string))) throw new ApiError(400, "Invalid credential!");

        return {
            token: user?.generateAuthToken(),
            refreshToken: user?.generateRefreshToken(),
        };
    }

    public emailVerify = async (token: String): Promise<void> => {
        const tokenHash = crypto.createHash('sha256').update(token as string).digest('hex');
        const tokenUser: ITokenEmail | null = await TokenEmail.findOne({ token: tokenHash });

        if (!tokenUser) {
            throw new ApiError(400, "Invalid or expired email verification tokens");
        }

        const user: IUser | null = await User.findById(tokenUser?.userId);
        if (!user || user.isEmailVerified) {
            throw new ApiError(400, "Unable to verify user email!");
        }

        user.isEmailVerified = true;

        await user.save({ validateBeforeSave: false });
        return;
    }


    public resendToken = async ({ email }: { email: String }) => {

        const user: IUser | null = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "Users doesn't found");
        }

        if (user?.isEmailVerified) {
            throw new ApiError(400, "User already verify!");
        }

        await TokenEmail.findOneAndDelete({ userId: user?._id });

        const token: string = user.generateResetToken();
        const min = 2;
        const tokenEmail: ITokenEmail = await TokenEmail.create({
            token,
            userId: user?._id,
            expiryAt: new Date(Date.now() + min * 60 * 1000)
        });

        if (!tokenEmail) {
            throw new ApiError(500, "Error while resend Token");
        }

        const currYear = new Date().getFullYear();
        await emailconfig.sendEmail({
            to: email as string,
            subject: 'Verify Email',
            template: 'verify-email',
            data: {
                expiryIn: min,
                currYear,
                companyName: 'Brand Builder',
                // token: `${process.env.BACKEND_URL}`,
                token: `${process.env.BACKEND_URL}/${token}`,
            }
        });

        return;
    }


    public forgetPassword = async ({ email }: { email: String }) => {

        const user: IUser = await User.findOne({ email });
        if (!user || !user?.isEmailVerified) {
            throw new ApiError(400, "Invalid credentials or Email isn't verify");
        }
        const min = 2;

        const token: string = user.generateResetToken();

        await ResetToken.create({
            token,
            userId: user?._id,
            expiryAt: new Date(Date.now() + min * 60 * 1000)
        });


        const currYear = new Date().getFullYear();

        await emailconfig.sendEmail({
            to: email as string,
            subject: 'Reset Password',
            template: 'forget-password',
            data: {
                expiryIn: min,
                currYear,
                companyName: 'Brand Builder',
                token,
            }
        });

        return;
    }



    public resetPassword = async ({ token, password }: { token: String, password: String }) => {
        try {

            const hashToken = crypto.createHash('sha256').update(token as string).digest('hex');

            const tokenUser: IResetToken | null = await ResetToken.findOne({ token: hashToken })

            if (!tokenUser) {
                throw new ApiError(400, "Invalid Token or expiry token!");
            }


            const user: IUser | null = await User.findById(tokenUser?.userId);
            if (!user) {
                throw new ApiError(400, "users doesn't exists");
            }

            user.password = password as string;

            await user.save();

            await ResetToken.findByIdAndDelete(tokenUser?._id);

            return;

        } catch (error: any) {
            throw error;
        }
    }

    public refreshToken = async (token: String): Promise<{ token: string }> => {

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded) {
                throw new ApiError(401, "Invalid token");
            }

            const user: IUser | null = await User.findById(decoded?._id);
            if (!user) {
                throw new ApiError(401, "Invalid refreshToken!");
            }

            return {
                token: user.generateAuthToken()
            }

        } catch (error: any) {
            throw error;
        }
    }


    // helper function

    private generateRandomPassword = (length: number = 9): string => {
        // Characters to include in the password
        const lowerCase = "abcdefghijklmnopqrstuvwxyz";
        const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

        // Combine all character sets
        const allCharacters: string = lowerCase + upperCase + numbers + symbols;

        // Ensure password includes at least one character from each set
        const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
        const passwordArray = [
            getRandomChar(lowerCase),
            getRandomChar(upperCase),
            getRandomChar(numbers),
            getRandomChar(symbols),
        ];

        // Fill the rest of the password length with random characters
        for (let i = passwordArray.length; i < length; i++) {
            passwordArray.push(getRandomChar(allCharacters));
        }

        // Shuffle the password to randomize character positions
        const shuffledPassword = passwordArray.sort(() => Math.random() - 0.5);

        // Return the password as a string
        return shuffledPassword.join('');
    }

}

export default new AuthService();