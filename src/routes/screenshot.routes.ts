
import { Router } from "express";
import screenshotController from "../controller/screenshot.controller";
import upload from "../utils/multer.utils";

const router = Router();

router.post("/:timestamId", upload.single('image'), screenshotController.uploadImage);



export default router;