import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import inviteService from "../service/invite.service";
import { ApiResponse } from "../utils/apiresponse";

class InviteController {

    invite = asyncHandler(async (req: Request, res: Response, _: NextFunction): Promise<void> => {

        await inviteService.invite({ ...req.body, ...req.params });//params inviteBy,organizationId
        res.status(200).json(new ApiResponse(200, "User invited succesfully and invitation link send in user email!"));
    });

    accept_invite = asyncHandler(async (req: Request, res: Response, _: NextFunction): Promise<void> => {

        try {

            await inviteService.accept_invite(req.params.token as string);

            res.status(400).redirect(`${process.env.FRONT_URL}/success`);
        } catch (error) {
            res.status(400).redirect(`${process.env.FRONT_URL}/error`);
        }

    });

    register_user = asyncHandler(async (req: Request, res: Response, _: NextFunction): Promise<void> => {

        await inviteService.register_user({ ...req.body });

        res.status(201).json(new ApiResponse(201, "User register succesfully!"));
    });

}


export default new InviteController();