import { Router } from "express";
import { authenticateClerk } from "../middlewares/isAuthenticated.js";
import { isAllowed } from "../controllers/auth.contoller.js";
import { getAllStats } from "../controllers/stat.controller.js";

const router = Router();

router.route("/").get(authenticateClerk, isAllowed, getAllStats);

export default router;
