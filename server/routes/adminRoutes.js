const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/api/admin/", adminController.adminSignInPage);
router.post("/api/admin/", adminController.adminSignIn);

router.get(
  "/api/admin/dashboard",
  adminController.authenticateToken,
  adminController.dashboard
);
router.get(
  "/api/admin/dashboard/about",
  adminController.authenticateToken,
  adminController.about
);
router.get(
  "/api/admin/dashboard/logout",
  adminController.authenticateToken,
  adminController.adminLogout
);

router.get(
  "/api/admin/dashboard/addUser",
  adminController.authenticateToken,
  adminController.addUser
);
router.post("/api/admin/dashboard/postUser", adminController.postUser);
router.post("/api/admin/dashboard/searchUser", adminController.searchUser);

router.get(
  "/api/admin/dashboard/view/:id",
  adminController.authenticateToken,
  adminController.viewUser
);
router.get(
  "/api/admin/dashboard/edit/:id",
  adminController.authenticateToken,
  adminController.editUser
);

router.put("/api/admin/dashboard/edit/:id", adminController.updateUser);
router.delete("/api/admin/dashboard/edit/:id", adminController.deleteUser);

module.exports = router;
