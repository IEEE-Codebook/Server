const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  q_name: {
    type: String,
    required: true,
  },
  q_platform: {
    type: String,
    required: true,
  },
  q_link: {
    type: String,
    required: false,
  },
  solved: {
    type: Boolean,
    required: false,
  },
  note: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("todo", todoSchema);
