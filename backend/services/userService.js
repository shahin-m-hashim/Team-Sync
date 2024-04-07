const bcrypt = require("bcrypt");
const moment = require("moment");
const users = require("../models/userModel");
const projects = require("../models/projectModel");

// GET
const getUserDetails = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  const { password, createdAt, updatedAt, usedOtps, __v, ...userData } =
    user._doc;
  return userData;
};

const getAllUserProjects = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  await user.populate("projects");

  const formattedProjects = user.projects.map((project) => {
    const { id, name, leader, icon, createdAt, progress, status } = project;
    const formattedDate = moment(createdAt).format("DD/MM/YYYY");
    return {
      id,
      name,
      leader,
      icon,
      createdAt: formattedDate,
      progress,
      status,
    };
  });

  return formattedProjects;
};

// POST
const createProject = async (userId, projectDetails) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");

  const newProject = await projects.create({
    ...projectDetails,
    leader: userId,
  });

  user.projects.push(newProject._id);
  await user.save();
  return newProject._id;
};

// PATCH
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
};

const setSecondaryDetails = async (userId, newSecondaryDetails) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");

  const { address, occupation, organization } = newSecondaryDetails;

  user.occupation = occupation;
  user.organization = organization;
  user.address = { ...user.address, ...address };

  await user.save();
};

const setContactDetails = async (userId, newContactDetails) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");

  const { secondaryEmail, phone } = newContactDetails;
  user.secondaryEmail = secondaryEmail;
  user.phone = { ...user.phone, ...phone };
  await user.save();
};

const setSecurityDetails = async (userId, newSecurityDetails) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");

  const { currentPassword, newPassword } = newSecurityDetails;

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) throw new Error("InvalidPassword");

  user.password = newPassword;
  await user.save();
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
  createProject,
  removeAccount,
  setProfilePic,
  getUserDetails,
  removeProfilePic,
  setPrimaryDetails,
  setContactDetails,
  getAllUserProjects,
  setSecurityDetails,
  setSecondaryDetails,
};
