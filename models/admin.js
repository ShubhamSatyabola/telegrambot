const mongoose = require("mongoose");
//admin schema to store admin informations and details
const adminSchema = mongoose.Schema(
  {
    messageNumber: {
      type: Number,
      default:0,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("admin", adminSchema); //creating model
module.exports = Admin;
