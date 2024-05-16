const express = require("express");
const router = express.Router();
const { adminLogin, adminLogout } = require("../controllers/adminController");

router.get("/logout", adminLogout);
router.post("/api/admin/", adminLogin);

module.exports = router;
