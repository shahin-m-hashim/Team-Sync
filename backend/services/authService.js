const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/userModel");
const otps = require("../models/otpModel");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const signUpUser = async (user) => await users.create(user);

const loginUser = async (email, password) => {
  const user = await users.findOne({ email });

  if (!user) {
    throw new Error("UnknownUser");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("InvalidPassword");
  }

  const { id } = user;

  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_KEY, {
    expiresIn: "1m",
  });

  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_KEY, {
    expiresIn: "1d",
  });

  return { id, accessToken, refreshToken };
};

const sendPassResetOtp = async (email) => {
  const user = await users.findOne({ email });

  if (!user) {
    throw new Error("UnknownUser");
  }

  // Generate a 6-digit OTP
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  console.log("Generated OTP:", otp);

  // Create a Nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_APP_PASS,
    },
  });

  const emailTemplatePath = path.join(
    __dirname,
    "../templates/resetPassEmail.ejs"
  );

  const renderedEmailTemplate = await ejs.renderFile(emailTemplatePath, {
    name: user.name,
    otp,
  });

  // Define email options
  let mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Password Reset OTP",
    html: renderedEmailTemplate,
  };

  // Send email
  const { envelope } = await transporter.sendMail(mailOptions);

  await otps.create({ user: user._id, otp });
  user.used_otps.push({ otp });
  await user.save();

  return { envelope };
};

const verifyOTP = async (otp) => {
  const otpDoc = await otps.findOne({ otp });
  if (!otpDoc) {
    throw new Error("InvalidOTP");
  }
  const { user } = otpDoc;
  await otps.deleteOne({ otp });

  const otpToken = jwt.sign({ userId: user }, process.env.JWT_OTP_KEY, {
    expiresIn: "3m",
  });
  return otpToken; // OTP is valid
};

const resetUserPassword = async ({ userId, password }) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("User not found");
  user.password = password;
  await user.save();
  return user.username;
};

module.exports = {
  signUpUser,
  loginUser,
  sendPassResetOtp,
  verifyOTP,
  resetUserPassword,
};
