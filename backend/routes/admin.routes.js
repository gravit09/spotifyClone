import { Router } from "express";
import { uploadSong } from "../controllers/admin.controller.js";
const router = Router();
router.route("/upload").post(uploadSong);

export default router;
