import { Router } from "express";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";
import { isAllowed } from "../controllers/auth.contoller.js";
import { getAllStats } from "../controllers/stat.controller.js";
const router = Router();

router.route("/").get(authenticateJWT, isAllowed, getAllStats);
