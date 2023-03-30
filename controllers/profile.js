const user = require("../models/user");

const getProfile = async (req, res) => {
  try {
    if (req.params.id) {
      const profile = await user.findOne({ name: req.params.id });
      if (profile) return res.status(200).json(profile);
      else return res.status(404).json({ Error: "No user found" });
    } else return res.status(200).json(req.user);
  } catch (err) {
    res.status(404).send({ error: err });
  }
};

const updateHandle = async (req, res) => {
  const handle1 = req.query.atcoder;
  const handle2 = req.query.codeforces;
  const name = req.query.name;
  const email = req.query.email;
  if (!handle1 && !handle2 && !name && !email) {
    res.status(404).json({ error: "No profile entered" });
  }
  const user_to_change = req.user;
  if (handle1) {
    user_to_change.atcoder = handle1;
  }
  if (handle2) {
    user_to_change.codeforces = handle2;
  }
  if (name) {
    user_to_change.name = name;
  }
  if (email) {
    user_to_change.email = email;
  }
  await user_to_change.save();
  res.json({ name: name, email: email, atcoder: handle1, codeforces: handle2 });
};

const addFriend = async (req, res) => {
  try {
    const cur_user = req.user;
    const userToAddFriend = req.query.username;
    const addUser = await user.findOne({ name: userToAddFriend });
    if (cur_user.following.includes(addUser._id)) {
      res.status(200).json({ following: addUser.following });
    } else {
      cur_user.following.push(addUser._id);
      await cur_user.save();
      res.status(200).json({ following: addUser.following });
    }
  } catch (err) {
    res.status(404).send({ error: err });
  }
};

module.exports = { getProfile, updateHandle, addFriend };
