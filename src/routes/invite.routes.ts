import { Router } from "express";
import inviteController from "../controller/invite.controller";
import { auth, authorize } from "../middleware/auth.middleware";


const router = Router();
// non-protected routes
router.get("/accept-invite", inviteController.accept_invite);
router.post("/register", inviteController.register_user);

router.use(auth, authorize(['admin', 'manager']));
router.post("/", inviteController.invite);

export default router;