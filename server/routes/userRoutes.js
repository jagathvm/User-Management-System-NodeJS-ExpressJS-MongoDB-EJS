import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { noCache } from "../middlewares/noCache.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/", userController.loginPage);
router.get("/signup", userController.signupPage);
router.get("/logout", userController.userLogout);

router.post("/", userController.userLogin);
router.post("/signup", userController.userSignup);

router.use(noCache, authenticateToken);
router.get("/home", userController.homePage);
router.get("/about", userController.about);

export default router;
