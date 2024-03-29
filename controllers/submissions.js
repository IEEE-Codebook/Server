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
  var atSubs = [];
  // console.log(following);
  for (var i = 0; i < following.length; i++) {
    const u = await user.findOne({ _id: following[i] });
    if (u.atcoder) {
      const atCoder_URL =
        "https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=" +
        u.atcoder +
        "&from_second=0";
      const atSubmit = await axios.get(atCoder_URL);
      atSubs.push(u.atcoder);
      atSubs.push(atSubmit.data);
    }
  }
  res.status(200).json({ handles: subs, atcoder: atSubs });
};

const getSubmission = async (req, res) => {};

module.exports = { mySubmission, friendSubmission, getSubmission };
