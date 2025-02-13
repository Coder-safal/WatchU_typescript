import { Router } from "express";
import departmentController from "../controller/department.controller";

const router = Router();


router.post("/add-employee/:userId/:departmentId", departmentController.addEmploye);
router.get("/all-employee/:departmentId", departmentController.getAllDepartmentEmployee);
router.post("/create", departmentController.createDepartment);

export default router;