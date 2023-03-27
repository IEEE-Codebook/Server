const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/requireLogin");
const {
  mySubmission,
  friendSubmission,
  getSubmission,
} = require("../controllers/submissions");

router.get("/me", requireLogin, mySubmission);
router.get("/:id",requireLogin,getSubmission)
router.get("/friend",requireLogin,friendSubmission)


module.exports = router;