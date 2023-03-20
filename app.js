const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");
const axios = require("axios");
const auth = require("./routes/auth.js");
const leaderboard = require("./routes/leaderboard");
const app = express();
const PORT = 8000;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // comment if this gives error.

app.use("/auth", auth);

app.use("/leaderboard", leaderboard);

app.listen(PORT, () => {
  console.log("server working on port ", PORT);
});
