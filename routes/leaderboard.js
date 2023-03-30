const express = require("express");
const router = express.Router();
const { leaderboard } = require("../controllers/leaderboard.js");

router.get("/all",leaderboard);

module.exports = router
