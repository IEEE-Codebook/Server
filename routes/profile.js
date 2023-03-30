const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/requireLogin");
const { getProfile, updateHandle,addFriend} = require("../controllers/profile");

router.get("/me", requireLogin, getProfile);
router.get("/:id",getProfile)
router.put("/edit",requireLogin,updateHandle)
router.put("/add",requireLogin,addFriend);

module.exports = router;