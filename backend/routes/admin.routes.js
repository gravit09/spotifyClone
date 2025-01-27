import { Router } from "express";
import { uploadSong } from "../controllers/admin.controller.js";
import { adminMiddleWare } from "../controllers/auth.contoller.js";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";
const router = Router();
router.route("/upload").post(authenticateJWT, adminMiddleWare, uploadSong);

export default router;
