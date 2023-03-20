const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  username: String,
  platform: String,
  score: Number,
});

module.exports = mongoose.model("leaderboard", leaderboardSchema);
