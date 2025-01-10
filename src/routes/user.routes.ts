import { Router } from "express";
import userController from "../controller/user.controller";

const router = Router();

router.post("/", userController.getMe);

export default router;