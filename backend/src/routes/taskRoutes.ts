import { Router } from "express";
import TaskController from "../controllers/TaskController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.post("/auth/tasks/create", authMiddleware, TaskController.createTask);
router.get("/auth/tasks", authMiddleware, TaskController.getAllTasks);
router.patch("/auth/tasks/:id", authMiddleware, TaskController.updateTaskStatus);

export default router;
