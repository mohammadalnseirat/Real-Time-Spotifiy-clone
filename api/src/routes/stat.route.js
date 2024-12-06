import { Router } from "express";
import { protectedRoute, requireAdmin } from "../middleWare/auth.middleware.js";
import { getStats } from "../controllers/stat.controller.js";

const router = Router();

router.get("/", protectedRoute, requireAdmin, getStats);

export default router;
