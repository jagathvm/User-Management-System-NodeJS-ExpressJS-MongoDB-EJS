import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { noCache } from "../middlewares/noCache.js";
import * as adminController from "../controllers/adminController.js";

const router = Router();

router.get("/", adminController.adminSignInPage);
router.post("/", adminController.adminSignIn);

router.use(noCache, authenticateToken);

router.get("/dashboard", adminController.dashboard);
router.get("/dashboard/about", adminController.about);
router.get("/dashboard/logout", adminController.adminLogout);

router.get("/dashboard/addUser", adminController.addUser);
router.post("/dashboard/postUser", adminController.postUser);
router.post("/dashboard/searchUser", adminController.searchUser);

router.get("/dashboard/view/:id", adminController.viewUser);
router.get("/dashboard/edit/:id", adminController.editUser);

router.put("/dashboard/edit/:id", adminController.updateUser);
router.delete("/dashboard/edit/:id", adminController.deleteUser);

export default router;
