const bcrypt = require("bcrypt");
const moment = require("moment");
const sendMail = require("../utils/sendMail");
const users = require("../models/userModel");
const otps = require("../models/otpModel");
const otpGenerator = require("otp-generator");

const signUpUser = async (user) => await users.create(user);

const loginUser = async (email, password) => {
  const user = await users.findOne({ email });
  if (!user) throw new Error("UnknownUser");
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("InvalidPassword");

  return user.id;
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
  signUpUser,
  loginUser,
  sendPassResetOtp,
  verifyPassResetOtp,
  resetUserPassword,
};
