import { Router, Request, Response } from "express";
import authRouter from "./auth.routes";
import { auth } from "../middleware/auth.middleware";
import userRoutes from "./user.routes";
import screenshotRoutes from "./screenshot.routes";
const router = Router();



// non-protected routes
router.use("/auth", authRouter);


// protected routes
router.use(auth);

// users routes
router.use("/user", userRoutes);

// screenshot routes
router.use("/screenshot", screenshotRoutes);


export default router;