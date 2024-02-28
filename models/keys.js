const mongoose = require("mongoose");

const keysSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Keys = mongoose.model("keys", keysSchema); //creating model
module.exports = Keys;
