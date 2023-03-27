const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/requireLogin");
const { getProfile } = require("../controllers/profile");

router.get("/me", requireLogin, getProfile);
router.get("/:id",getProfile)

module.exports = router;