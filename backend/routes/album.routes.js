import { Router } from "express";
import { getAllAlbum } from "../controllers/album.controller.js";
import { getAllAlbumById } from "../controllers/album.controller.js";
const router = Router();
router.route("/").get(getAllAlbum);
router.route("/:id").get(getAllAlbumById);

export default router;
