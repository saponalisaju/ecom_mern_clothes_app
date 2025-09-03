const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
    minLength: [3, "At least 3 character are needed"],
    maxLength: [24, "maximum 24 character are valid"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        return emailRegex.test(v);
      },
      message: "Please enter a valid email",
    },
  },

  password: {
    type: String,
    minLength: [6, "The length of user password can be 6 character"],
    set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
  },
});
const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
