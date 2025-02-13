import { Router } from "express";
import userController from "../controller/user.controller";
import { authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/", userController.getMe);
router.patch("/password", userController.updatePassword);

router.use(authorize(['admin']));

router.patch("/admin/update-user/:userId", userController.updateUserByAdmin);

export default router;