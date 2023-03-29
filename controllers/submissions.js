const user = require("../models/user");
const axios = require("axios");
const mySubmission = async (req, res) => {
  const handle = req.user.codeforces;
  console.log(handle);
  res.status(200).json({ handle: handle });
};

const friendSubmission = async (req, res) => {
  const following = req.user.following;
  var subs = [];

  for (var i = 0; i < following.length; i++) {
    const u = await user.findOne({ _id: following[i] });
    const URL =
      "https://codeforces.com/api/user.status?handle=" +
      u.codeforces +
      "&from=1&count=100";
    const submits = await axios.get(URL);
    subs.push(u.codeforces);
    subs.push(submits.data.result);
    // console.log(subs);
  }
  // console.log(subs);
  res.status(200).json({ handles: subs });
};

const getSubmission = async (req, res) => {};

module.exports = { mySubmission, friendSubmission, getSubmission };
