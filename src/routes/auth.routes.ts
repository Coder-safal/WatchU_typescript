import { Router } from "express";
import authController from "../controller/auth.controller";
import { authValidation } from "../middleware/validate.middleware";

const router = Router();

router.post("/register", authValidation.register, authController.register);
router.post("/login", authValidation.login, authController.login);
router.post("/refresh-token", authValidation.refreshToken, authController.refreshToken);
router.get("/verify-email/:token", authValidation.verifyEmail, authController.emailVerify);
router.post("/resend-token", authController.resendToken);
router.post("/forget-password", authValidation.forgetPassword, authController.forgetPassword);
router.post("/reset-password", authValidation.resetPassword, authController.resetPassword);
router.delete("/delete", authController.deleteUser);


export default router;