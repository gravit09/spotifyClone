import { Router } from "express";
import { getAllAlbum } from "../controllers/album.controller.js";
import { getAllAlbumById } from "../controllers/album.controller.js";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";
const router = Router();
router.route("/").get(authenticateJWT, getAllAlbum);
router.route("/:id").get(authenticateJWT, getAllAlbumById);

export default router;
