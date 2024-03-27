const users = require("../models/userModel");

const getProfilePic = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UserNotFound");
  return user.profilePic;
};

const setProfilePic = async (userId, newProfilePic) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UserNotFound");
  user.profilePic = newProfilePic;
  await user.save();
  return user.profilePic;
};

const removeProfilePic = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UserNotFound");
  user.profilePic = "";
  await user.save();
};

const getBasicDetails = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UserNotFound");
  const { profilePic, username, fname, tag, bio, socialLinks } = user;
  return { profilePic, username, fname, tag, bio, socialLinks };
};

const setBasicDetails = async (userId, newBasicDetails) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UserNotFound");
  const { fname, tag, bio, socialLinks } = newBasicDetails;
  user.tag = tag;
  user.bio = bio;
  user.fname = fname;
  user.socialLinks = { ...user.socialLinks, ...socialLinks };
  await user.save();
  return {
    fname: user.fname,
    tag: user.tag,
    bio: user.bio,
    socialLinks: user.socialLinks,
  };
};

const getPublicDetails = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UserNotFound");
  const { phone, email, occupation, address, organization } = user;
  return { phone, email, address, occupation, organization };
};

const setPublicDetails = async (userId, newPublicDetails) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UserNotFound");

  const { address, phone, occupation, organization } = newPublicDetails;

  user.phone = phone;
  user.occupation = occupation;
  user.organization = organization;
  user.address = { ...user.address, ...address };

  await user.save();
  return {
    phone: user.phone,
    occupation: user.occupation,
    organization: user.organization,
    address: user.address,
  };
};

module.exports = {
  getProfilePic,
  setProfilePic,
  removeProfilePic,
  getBasicDetails,
  setBasicDetails,
  getPublicDetails,
  setPublicDetails,
};
