import User, { IUser } from "../model/User";
import authService from "../service/auth.service";
import ApiError from "../utils/apiError";
import { ApiResponse } from "../utils/apiresponse";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response, NextFunction } from 'express';
import { param } from 'express-validator';


class AuthController {

    deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email } = req.body;


        if (!email) {
            throw new ApiResponse(400, "Email is required!");
        }

        const user: IUser | null = await User.findOneAndDelete({ email });


        if (!user) {
            next(new ApiError(404, "user doesn't found!"));
        }

        res.status(200).json(new ApiResponse(200, "User delete succesfully!"));
    });

    public register = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        // console.log("req.body: ", req.body);

        await authService.register({ ...req.body });
        res.status(201).json(new ApiResponse(201, "Please verify your email,OTP has been send to your email"));

    });

    public login = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const result: any = await authService.login({ ...req.body });
        res.status(200).json({ success: true, data: { message: "User login succesfully", ...result } });
    });

    public emailVerify = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const { token } = req.params;
            console.log("Token is: ", token);
            await authService.emailVerify(token);
            res.status(200).json(
                new ApiResponse(200, "Email verify succesfully")
            );

            // res.status(200).redirect(`${process.env.FRONT_URL}/verify-email/success`);
        } catch (error) {
            // If verification fails, render the "Sorry" page
            // res.status(400).redirect(`${process.env.FRONT_URL}/verify-email/error`)
            next(error);
        }
    }
    );

    public resendToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            await authService.resendToken(req.body);
            res.status(200).json(new ApiResponse(200, "Please verify your email,OTP has been send to your email"));
        } catch (error) {
            next(error);
        }
    })


    public forgetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await authService.forgetPassword(req.body);

        res.status(200).json(new ApiResponse(200, "Token send to you email"));
    });


    public resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await authService.resetPassword(req.body);
        res.status(200).json(new ApiResponse(200, "Password reset succesfully!"));
    });



    public refreshToken = asyncHandler(async (req, res) => {
        const { refreshToken: token } = req.body;

        const result = await authService.refreshToken(token);

        res.status(200).json({ success: true, data: { "message": "AuthToken generate succesfully!", ...result } })

    });

}


export default new AuthController();