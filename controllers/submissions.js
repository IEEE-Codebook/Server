const user = require("../models/user");
const axios = require("axios")
const mySubmission = async (req, res) => {
  const handle = req.user.codeforces;
  console.log(handle)
  res.status(200).json({handle:handle});
};

const friendSubmission = async (req, res) => {

};

const getSubmission = async (req, res) => {
    
};

module.exports = { mySubmission, friendSubmission, getSubmission };
