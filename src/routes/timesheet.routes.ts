import { Router } from "express";
import timesheetController from "../controller/timesheet.controller";


const router = Router();

router.post("/:projectId/start", timesheetController.start);
router.post("/stop/:timeId", timesheetController.stop);
router.post("/resume/:timeId", timesheetController.resume);
router.post("/pause/:timeId", timesheetController.pause);


export default router;