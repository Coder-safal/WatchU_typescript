import { Router } from "express";
import authController from "../controller/auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.get("/verify-email/:token", authController.emailVerify);
router.post("/resend-token", authController.resendToken);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);
router.delete("/delete",authController.deleteUser);


export default router;