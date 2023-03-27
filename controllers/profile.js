const user = require("../models/user");

const getProfile = async (req, res) => {
  try {
    if (req.params.id) {
      const profile = await user.findOne({ name: req.params.id });
      if (profile) return res.status(200).json(profile);
      else return res.status(404).json({ Error: "No user found" });
    } 
        else return res.status(200).json(req.user);
  } catch (err) {
    res.status(404).send({ error: err });
  }
};

module.exports = { getProfile };
