const express = require("express");
const connectDB = require("./config/db.js");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const auth = require("./routes/auth.js");
const user = require("./routes/user.js");
const submissions = require("./routes/submissions");
const image = require("./models/image");
const User = require("./models/user");
const profile = require("./routes/profile.js");
const { requireLogin } = require("./middleware/requireLogin.js");
const { JWT_SECRET } = require("./key.js");
const app = express();
const PORT = 8000;
const upload = require("./routes/upload");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

let gfs;
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // comment if this gives error.

const conn = mongoose.connection;
conn.once("open", function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

app.use("/file", upload);
app.get("/file/:filename", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gfs.createReadStream(file.filename);
    console.log(readStream);
    readStream.pipe(res);
  } catch (error) {
    res.send("not found");
  }
});
// app.delete("/file/:filename", async (req, res) => {
//   try {
//     await gfs.files.deleteOne({ filename: req.params.filename });
//     res.send("success");
//   } catch (error) {
//     console.log(error);
//     res.send("An error occured.");
//   }
// });

app.use("/auth", auth);
app.use("/user", user);
app.use("/profile", profile);
app.use("/submissions", submissions);
app.use("/name", requireLogin, async (req, res) => {
  const token = req.query.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  const cur_user = await User.findById(decoded._id);
  if (cur_user) res.status(200).json({ name: cur_user.name });
  else res.status(404).json({ error: "No user found" });
});
app.listen(PORT, () => {
  console.log("server working on port ", PORT);
});
