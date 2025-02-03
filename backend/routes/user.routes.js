import { Router } from "express";
import {
  loginUserHandler,
  userSignUpHandler,
  isAllowed,
} from "../controllers/auth.contoller.js";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";
import { getAllUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(loginUserHandler);
router.route("/signup").post(userSignUpHandler);
router.route("/protected").get(authenticateJWT, isAllowed);
router.route("/").post(authenticateJWT, getAllUser);

export default router;
