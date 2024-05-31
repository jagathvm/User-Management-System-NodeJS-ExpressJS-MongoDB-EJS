const express = require("express");
const router = express.Router();
const {
  adminSignIn,
  adminSignInPage,
  dashboard,
  about,
  adminLogout,
  addUser,
  postUser,
  searchUser,
  viewUser,
  editUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");

const authenticateToken = require("../middlewares/authenticateToken");
const noCache = require("../middlewares/noCache");

router.get("/api/admin/", adminSignInPage);
router.post("/api/admin/", adminSignIn);

router.get("/api/admin/dashboard", noCache, authenticateToken, dashboard);
router.get("/api/admin/dashboard/about", noCache, authenticateToken, about);
router.get(
  "/api/admin/dashboard/logout",
  noCache,
  authenticateToken,
  adminLogout
);

router.get("/api/admin/dashboard/addUser", noCache, authenticateToken, addUser);
router.post("/api/admin/dashboard/postUser", postUser);
router.post("/api/admin/dashboard/searchUser", searchUser);

router.get(
  "/api/admin/dashboard/view/:id",
  noCache,
  authenticateToken,
  viewUser
);
router.get(
  "/api/admin/dashboard/edit/:id",
  noCache,
  authenticateToken,
  editUser
);

router.put("/api/admin/dashboard/edit/:id", updateUser);
router.delete("/api/admin/dashboard/edit/:id", deleteUser);

module.exports = router;
