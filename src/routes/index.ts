import { Router, Request, Response } from "express";
import authRouter from "./auth.routes";
import { auth, authorize } from "../middleware/auth.middleware";
import userRoutes from "./user.routes";
import screenshotRoutes from "./screenshot.routes";
import timesheetRoutes from "./timesheet.routes";
import projectRoutes from "./project.routes";
const router = Router();

import inviteRouter from "./invite.routes";
import departmentRouter from "./department.routes";

// non-protected routes
router.use("/auth", authRouter);

router.use("/invite", inviteRouter);

// protected routes
router.use(auth);

// users routes
router.use("/users", userRoutes);

// screenshot routes
router.use("/screenshot", screenshotRoutes);

router.use("/time", timesheetRoutes);

// only admin access routes
router.use(authorize(["admin"]));

router.use("/department", departmentRouter);

router.use("/project", projectRoutes);

export default router;
