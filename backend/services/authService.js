const bcrypt = require("bcrypt");
const moment = require("moment");
const sendMail = require("../utils/sendMail");
const users = require("../models/userModel");
const otps = require("../models/otpModel");
const otpGenerator = require("otp-generator");

const signUpUser = async (user) => {
  const { id } = await users.create(user);
  console.log(`A new user ${id} is registered`);
};

const loginUser = async (email, password) => {
  const user = await users.findOne({ email });
  if (!user) throw new Error("UnknownUser");
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("InvalidPassword");
  user.status = "active";
  await user.save();
  return user.id;
};

const logoutUser = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  user.status = "inActive";
  user.last_seen = Date.now();
  await user.save();
};

const sendPassResetOtp = async (email) => {
  const user = await users.findOne({ email });
  if (!user) throw new Error("UnknownUser");

  // Generate a 6-digit OTP
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  console.log("Generated OTP:", otp);

  sendMail(user, otp); // send mail asynchronously to speed up response

  await otps.create({ user: user._id, otp });
};

const verifyPassResetOtp = async (otp) => {
  const otpDoc = await otps.findOne({ otp });
  if (!otpDoc) throw new Error("InvalidOTP");
  const { user } = otpDoc;
  await otps.deleteOne({ otp });
  return user;
};

const resetUserPassword = async (userId, password) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  const date = moment().format("DD-MM-YYYY hh:mm:ss A");
  user.used_otps.push(date);
  user.password = password;
  await user.save();
};

module.exports = {
  loginUser,
  signUpUser,
  logoutUser,
  sendPassResetOtp,
  resetUserPassword,
  verifyPassResetOtp,
};
