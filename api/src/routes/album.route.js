import { Router } from "express";
import {
  getAllAlbums,
  getSingleAlbum,
} from "../controllers/album.controller.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:albumId", getSingleAlbum);
export default router;
