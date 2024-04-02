const bcrypt = require("bcrypt");
const users = require("../models/userModel");

// GET
const getUserDetails = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  const { password, createdAt, usedOtps, __v, ...userData } = user._doc;
  return userData;
};

// SET
const setProfilePic = async (userId, newProfilePic) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  user.profilePic = newProfilePic;
  await user.save();
  return user.profilePic;
};

const setPrimaryDetails = async (userId, newPrimaryDetails) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  const { fname, username, pronoun, tag, bio, socialLinks } = newPrimaryDetails;
  user.fname = fname;
  user.username = username;
  user.pronoun = pronoun;
  user.tag = tag;
  user.bio = bio;
  user.socialLinks = { ...user.socialLinks, ...socialLinks };
  await user.save();
  return {
    fname: user.fname,
    username: user.username,
    pronoun: user.pronoun,
    tag: user.tag,
    bio: user.bio,
    socialLinks: user.socialLinks,
  };
};

const setSecondaryDetails = async (userId, newSecondaryDetails) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");

  const { address, occupation, organization } = newSecondaryDetails;

  user.occupation = occupation;
  user.organization = organization;
  user.address = { ...user.address, ...address };

  await user.save();
  return {
    address: user.address,
    occupation: user.occupation,
    organization: user.organization,
  };
};

// DELETE
const removeProfilePic = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  user.profilePic = "";
  await user.save();
};

const removeAccount = async (userId, password) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("InvalidPassword");

  if (user.role === "ADMIN" && isPasswordValid)
    await users.findByIdAndDelete(userId);
  else throw new Error("AccountDeletionError");
};

module.exports = {
  removeAccount,
  setProfilePic,
  getUserDetails,
  removeProfilePic,
  setPrimaryDetails,
  setSecondaryDetails,
};
