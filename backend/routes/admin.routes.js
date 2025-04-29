import { Router } from "express";
import { uploadSong } from "../controllers/admin.controller.js";
import { adminMiddleWare } from "../controllers/auth.contoller.js";
import { authenticateClerk } from "../middlewares/isAuthenticated.js";
import { deleteSong } from "../controllers/admin.controller.js";
import { uploadAlbum } from "../controllers/admin.controller.js";
import { deleteAlbum } from "../controllers/admin.controller.js";

const router = Router();

router.route("/upload").post(authenticateClerk, adminMiddleWare, uploadSong);
router
  .route("/delete/:id")
  .post(authenticateClerk, adminMiddleWare, deleteSong);
router.route("/album").post(authenticateClerk, adminMiddleWare, uploadAlbum);
router
  .route("/album/:id")
  .post(authenticateClerk, adminMiddleWare, deleteAlbum);

export default router;
