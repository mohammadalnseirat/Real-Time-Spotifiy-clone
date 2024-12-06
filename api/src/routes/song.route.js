import { Router } from "express";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYouSongs,
  getTrendingSongs,
} from "../controllers/song.controller.js";
import { protectedRoute, requireAdmin } from "../middleWare/auth.middleware.js";

const router = Router();

router.get("/", protectedRoute, requireAdmin, getAllSongs); // for admin
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
export default router;
