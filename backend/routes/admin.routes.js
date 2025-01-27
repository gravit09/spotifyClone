import { Router } from "express";
import { uploadSong } from "../controllers/admin.controller.js";
import { adminMiddleWare } from "../controllers/auth.contoller.js";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";
import { deleteSong } from "../controllers/admin.controller.js";
import { uploadAlbum } from "../controllers/admin.controller.js";
import { deleteAlbum } from "../controllers/admin.controller.js";
const router = Router();
router.route("/upload").post(authenticateJWT, adminMiddleWare, uploadSong);
router.route("/delete/:id").post(authenticateJWT, adminMiddleWare, deleteSong);
router
  .route("/uploadAlbum")
  .post(authenticateJWT, adminMiddleWare, uploadAlbum);
router.route(authenticateJWT, adminMiddleWare, deleteAlbum);

export default router;
