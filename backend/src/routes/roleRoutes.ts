import { Router } from "express";
import RoleController from "../controllers/RoleController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.post("/role/create", RoleController.createRole);

export default router;
