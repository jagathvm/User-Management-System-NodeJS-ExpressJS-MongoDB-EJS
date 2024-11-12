import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { noCache } from "../middlewares/noCache.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/api/user/", userController.loginPage);
router.get("/api/user/signup", userController.signupPage);
router.get("/api/user/logout", userController.userLogout);

router.post("/api/user/", userController.userLogin);
router.post("/api/user/signup", userController.userSignup);

router.use(noCache, authenticateToken);
router.get("/api/user/home", userController.homePage);
router.get("/api/user/about", userController.about);

export default router;
