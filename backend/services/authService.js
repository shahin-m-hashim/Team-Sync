const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/userModel");

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

  const { id, username } = user;

  const accessToken = jwt.sign(
    { userId: id, username },
    process.env.JWT_ACCESS_KEY,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: id, username },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: "1d" }
  );

  return { accessToken, refreshToken };
};

module.exports = { signUpUser, loginUser };
