import { Router } from "express";
import projectController from "../controller/project.controller";

const router = Router();

router.post("/create", projectController.create);


export default router;