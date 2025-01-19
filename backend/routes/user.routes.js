import { Router } from "express";
import {
  loginUserHandler,
  userSignUpHandler,
} from "../controllers/auth.contoller.js";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";

const router = Router();

router.route("/login").post(loginUserHandler);
router.route("/signup").post(userSignUpHandler);

export default router;
