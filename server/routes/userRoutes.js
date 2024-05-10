const express = require("express");
const router = express.Router();
const { userLogin, userSignup } = require("../controllers/userController");

router.post("/", userLogin);
router.post("/", userSignup);

module.exports = router;
