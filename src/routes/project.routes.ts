import { Router } from "express";
import projectController from "../controller/project.controller";

const router = Router();

router.post("/create/:departmentId", projectController.create);
router.patch("/add-employee/:employeeId/:projectId", projectController.addEmployee);

router.get(
  "/project-employees/:projectId/:departmentId",
  projectController.getAllProjectEmployee
);

export default router;
