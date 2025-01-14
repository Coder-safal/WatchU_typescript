import { Router, Request, Response } from "express";
import authRouter from "./auth.routes";
import { auth } from "../middleware/auth.middleware";
import userRoutes from "./user.routes";
import screenshotRoutes from "./screenshot.routes";
const router = Router();

import inviteRouter from "./invite.routes";


// non-protected routes
router.use("/auth", authRouter);

router.use("/invite", inviteRouter);

// protected routes
router.use(auth);

// users routes
router.use("/user", userRoutes);

// screenshot routes
router.use("/screenshot", screenshotRoutes);

// manager and 


export default router;