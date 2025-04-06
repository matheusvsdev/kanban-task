import { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import UserController from "../controllers/UserController";

const router = Router();

router.post("/auth/user/register", UserController.registerUser);
router.get("/auth/user/me", authMiddleware, UserController.userSelf);
router.get("/auth/user", UserController.getAllUsers);
router.get("/auth/user/:id", authMiddleware, UserController.getUserById);

export default router;
