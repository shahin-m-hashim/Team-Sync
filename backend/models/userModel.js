const bcrypt = require("bcrypt");
const moment = require("moment");
const mongoose = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [3, "Minimum length is 3 characters"],
    maxLength: [20, "Maximum length is 20 characters"],
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Username is required"],
    minlength: [5, "Minimum length is 5 characters"],
    maxLength: [20, "Maximum length is 20 characters"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email is required"],
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: [isStrongPassword, "Please enter a strong password"],
  },
  createdAt: {
    type: String,
    default: () => moment().format("DD-MM-YYYY hh:mm:ss A"),
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.post("save", (userDoc, next) => {
  console.log(`New user with id ${userDoc.id} is registered`);
  next();
});

// add the new user to Users collection
module.exports = mongoose.model("users", userSchema);
