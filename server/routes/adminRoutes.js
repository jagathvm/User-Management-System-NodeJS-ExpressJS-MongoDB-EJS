import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { noCache } from "../middlewares/noCache.js";
import * as adminController from "../controllers/adminController.js";

const router = Router();

router.use(noCache, authenticateToken);

router.get("/dashboard", adminController.dashboard);
router.get("/dashboard/about", adminController.about);
router.get("/dashboard/logout", adminController.adminLogout);

router.get("/dashboard/addUser", adminController.addUser);
router.get("/dashboard/view/:username", adminController.viewUser);

router.post("/dashboard/postUser", adminController.postUser);
router.post("/dashboard/searchUser", adminController.searchUser);

router.put("/dashboard/view/update/:username", adminController.updateUser);
router.delete("/dashboard/view/delete/:username", adminController.deleteUser);

export default router;
