const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { JWT_SECRET } = require("../key");

const signup = async (req, res) => {
  const name = req.query.name;
  const email = req.query.email;
  const password = req.query.password;
  const codeforces = req.query.codeforces;
  if (!name || !email || !password || !codeforces) {
    return res.status(422).json({ message: "Enter all fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ message: "Email already exists" });
      }
      bcrypt
        .hash(password, 15)
        .then((hpass) => {
          const user = new User({
            name,
            email,
            password: hpass,
            codeforces,
          });

          user
            .save()
            .then((user) => {
              const token = jwt.sign({ _id: user._id }, JWT_SECRET);
              res.status(200).json({
                _id: user._id,
                token: token,
                name: user.name,
                email: user.email,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log("request error");
      console.log(err);
    });
};

const login = async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  if (!email || !password) {
    res.status(422).json({ message: "please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      res.status(422).json({ message: "Invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          res.json({
            _id: savedUser._id,
            token: token,
            name: savedUser.name,
            email: savedUser.email,
          });
        } else {
          res.status(422).json({ message: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

module.exports = { signup, login };
