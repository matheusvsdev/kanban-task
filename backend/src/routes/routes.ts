import { Router } from "express";
import UserController from "../controllers/UserController";
import RoleController from "../controllers/RoleController";
import TaskController from "../controllers/TaskController";

const router = Router();

// Roles
router.post("/roles/create", RoleController.createRole);

// Users
router.post("/users/register", UserController.registerUser);
router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);

// Tasks
router.post("/tasks/create", TaskController.createTask);
router.get("/tasks", TaskController.getAllTasks);
router.patch("/tasks/:id", TaskController.updateTaskStatus);

export default router;
