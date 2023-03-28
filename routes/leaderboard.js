const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const Leaderboard = mongoose.model("Leaderboard");

const getRating = async (handle) => {
  const url = `https://codeforces.com/api/user.rating?handle=${handle}`;
  try {
    const response = await axios.get(url);

    const data = response.data.result;
    if (data.length === 0) {
      return 0;
    }
    const latestRating = data[data.length - 1].newRating;
    return latestRating;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

app.post("/score", async (req, res) => {
  const { username, platform } = req.body;
  const score = await getRating(username);
  const newScore = { username, platform, score };
  try {
    const result = await Leaderboard.findOneAndReplace(
      { username, platform },
      newScore,
      { new: true, upsert: true }
    );
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/:platform", async (req, res) => {
  const { platform } = req.params;
  try {
    const leaderboard = await Leaderboard.find({ platform });
    for (let i = 0; i < leaderboard.length; i++) {
      const rating = await getRating(leaderboard[i].username);
      leaderboard[i].score = rating;
      await leaderboard[i].save();
    }
    const sortedLeaderboard = await Leaderboard.find({ platform }).sort(
      "-score"
    );
    res.json(sortedLeaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
