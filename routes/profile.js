const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/requireLogin");
const { getProfile, updateHandle } = require("../controllers/profile");

router.get("/me", requireLogin, getProfile);
router.get("/:id",getProfile)
router.put("/edit",requireLogin,updateHandle)

module.exports = router;