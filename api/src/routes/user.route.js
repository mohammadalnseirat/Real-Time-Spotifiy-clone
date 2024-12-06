import { Router } from "express";
import { getAllMessages, getAllUsers } from "../controllers/user.controller.js";
import { protectedRoute } from "../middleWare/auth.middleware.js";

const router = Router();

router.get("/", protectedRoute, getAllUsers);
router.get("/messages/:userId", protectedRoute, getAllMessages);

export default router;
