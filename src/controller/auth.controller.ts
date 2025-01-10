import authService from "../service/auth.service";
import { ApiResponse } from "../utils/apiresponse";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response, NextFunction } from 'express';
import { param } from 'express-validator';


class AuthController {

    public register = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
            await authService.emailVerify(token);
            // res.status(200).json(
            //     new ApiResponse(200, "Email verify succesfully")
            // );
            res.status(200).render('emailVerify');
        } catch (error) {
            // If verification fails, render the "Sorry" page
            res.status(400).render('invalidEmail')
            res.redirect('http://frontend.example.com/success');
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