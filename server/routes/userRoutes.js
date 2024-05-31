const express = require("express");
const router = express.Router();

const {
  loginPage,
  signupPage,
  userLogin,
  userSignup,
  homePage,
  about,
  userLogout,
} = require("../controllers/userController");

const authenticateToken = require("../middlewares/authenticateToken");
const noCache = require("../middlewares/noCache");

router.get("/api/user/", loginPage);
router.get("/api/user/signup", signupPage);
router.get("/api/user/logout", userLogout);
router.get("/api/user/home", noCache, authenticateToken, homePage);
router.get("/api/user/about", noCache, authenticateToken, about);

router.post("/api/user/", userLogin);
router.post("/api/user/signup", userSignup);

module.exports = router;
