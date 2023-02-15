const { MONGOURI } = require("../key.js");
const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(MONGOURI);
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connection done");
  });
  mongoose.connection.on("error", (err) => {
    console.log("ERROR:( ", err);
  });
};

module.exports = connectDB;
