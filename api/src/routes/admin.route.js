import { Router } from "express";
import { protectedRoute, requireAdmin } from "../middleWare/auth.middleware.js";
import {
  checkAdmin,
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/check-admin", protectedRoute, requireAdmin, checkAdmin);
router.post("/songs", protectedRoute, requireAdmin, createSong);
router.delete("/songs/:id", protectedRoute, requireAdmin, deleteSong);
router.post("/albums", protectedRoute, requireAdmin, createAlbum);
router.delete("/albums/:id", protectedRoute, requireAdmin, deleteAlbum);

export default router;
