const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../key");
const User = require("../models/user");

const requireLogin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      // Get user from the token
      const cur_user = await User.findById(decoded._id);
      req.user = cur_user
      // User.findOne({ _id: decoded.id }).then((cur_user) => {
      //   console.log(cur_user);
      //   req.user = cur_user;
        next();
      // });
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

module.exports = { requireLogin };
