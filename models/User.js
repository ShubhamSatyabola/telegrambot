const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    chatId: {
      type: Number,
      required: true,
    },
    allowed : {
      type: String,
      default: "true" // yes or no
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema); //creating model
module.exports = User;
