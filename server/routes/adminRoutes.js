const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController");

router.post("/api/admin/", adminLogin);

module.exports = router;
