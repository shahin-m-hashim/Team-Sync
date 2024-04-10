const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const projects = require("../models/projectModel");
const invitations = require("../models/invitationModel");
const notifications = require("../models/notificationModel");

// POST
const sendProjectInvitation = async (userId, projectId, username, role) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const project = await projects.findById(projectId).session(session);
    if (!project) throw new Error("UnknownProject");

    const invitingUser = await users.findById(userId).session(session);
    if (!invitingUser) throw new Error("UnknownInvitingUser");

    const invitedUser = await users.findOne({ username }).session(session);
    if (!invitedUser) throw new Error("UnknownInvitedUser");

    const newInvitation = await invitations.create(
      [
        {
          project: projectId,
          invitedBy: userId,
          invitedUser: invitedUser._id,
          invitationRole: role,
          status: "pending",
        },
      ],
      { session }
    );

    project.invitations.push(newInvitation[0]._id);
    await project.save({ session });

    const notificationMessage = `You have been invited to join ${project.name} as a ${role} by ${invitingUser.username}`;
    const newNotification = await notifications.create(
      [
        {
          type: "projectInvitation",
          message: notificationMessage,
          invitation: newInvitation[0]._id,
          isRead: false,
        },
      ],
      { session }
    );

    invitedUser.notifications.push(newNotification[0]._id);
    await invitedUser.save({ session });

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const createTeam = async (userId, projectId, teamDetails) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");

  const project = await projects.findById(projectId);
  if (!project) throw new Error("UnknownProject");

  const newTeam = await teams.create({
    ...teamDetails,
    leader: userId,
    parent: projectId,
    guide: project.guide,
  });

  user.teams.push(newTeam._id);
  project.teams.push(newTeam._id);
  await user.save();
  await project.save();
  return newTeam._id;
};

// PATCH
const setProjectDetails = async (projectId, newProjectDetails) => {
  const project = await projects.findById(projectId);
  if (!project) throw new Error("UnknownProject");
  const { name, description } = newProjectDetails;
  project.name = name;
  project.description = description;
  await project.save();
};

const setProjectIcon = async (projectId, newProjectIcon) => {
  const project = await projects.findById(projectId);
  if (!project) throw new Error("UnknownProject");
  project.icon = newProjectIcon;
  await project.save();
  return project.icon;
};

module.exports = {
  createTeam,
  setProjectIcon,
  setProjectDetails,
  sendProjectInvitation,
};
