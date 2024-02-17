const users = require("../models/userModel");

const getEntireUserDetails = async (userId) => {
  const user = await users.findById(userId).select("-password -__v");
  if (!user) throw new Error("UserNotFound");
  return user;
};

module.exports = getEntireUserDetails;
