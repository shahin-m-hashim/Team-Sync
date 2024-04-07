const mongoose = require("mongoose");
const users = require("../models/userModel");
const projects = require("../models/projectModel");
const invitations = require("../models/invitationModel");
const notifications = require("../models/notificationModel");

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

module.exports = { setProjectIcon, setProjectDetails, sendProjectInvitation };
