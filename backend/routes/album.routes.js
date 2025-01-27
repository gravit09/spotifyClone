import { Router } from "express";
import { getAllAlbum } from "../controllers/album.controller";
import { getAllAlbumById } from "../controllers/album.controller";
import { authenticateJWT } from "../middlewares/isAuthenticated";
const router = Router();
router.route("/").get(authenticateJWT, getAllAlbum);
router.route("/:id").get(authenticateJWT, getAllAlbumById);

export default router;
