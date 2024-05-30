const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/api/user/", userController.loginPage);
router.get("/api/user/signup", userController.signupPage);
router.get(
  "/api/user/home",
  userController.authenticateToken,
  userController.homePage
);
router.get("/api/user/about", userController.about);
router.get("/api/user/logout", userController.userLogout);

router.post("/api/user/", userController.userLogin);
router.post("/api/user/signup", userController.userSignup);

module.exports = router;
