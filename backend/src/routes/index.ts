import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import roleRoutes from "./roleRoutes";
import taskRoutes from "./taskRoutes";

const router = Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(roleRoutes);
router.use(taskRoutes);

export default router;
