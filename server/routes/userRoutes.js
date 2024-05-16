const express = require("express");
const router = express.Router();
const {
  loginPage,
  signupPage,
  userLogin,
  userSignup,
  userLogout,
} = require("../controllers/userController");

router.get("/api/user/", loginPage);
router.get("/api/user/signup", signupPage);
router.get("/logout", userLogout);

router.post("/api/user/", userLogin);
router.post("/api/user/signup", userSignup);

module.exports = router;
