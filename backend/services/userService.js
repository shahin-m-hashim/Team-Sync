const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const users = require("../models/userModel");
const projects = require("../models/projectModel");
const { io, connectedUsers } = require("../server");
const activities = require("../models/activityModel");
const invitations = require("../models/invitationModel");
const notifications = require("../models/notificationModel");

// GET
const getUserDetails = async (userId) => {
  const user = await users
    .findById(userId)
    .select(
      "email address socialLinks phone role status profilePic username fname tag bio pronoun organization occupation secondaryEmail last_seen"
    );
  if (!user) throw new Error("UnknownUser");
  return user;
};

const getAllUserProjects = async (userId) => {
  const user = await users.findById(userId).select("projects").populate({
    path: "projects",
    select: "name createdAt icon progress status leader guide members",
  });
  if (!user) throw new Error("UnknownUser");

  const formattedProjects = user.projects.map((project) => {
    let role = "Member";

    const createdAt = moment(project.createdAt).format("DD/MM/YYYY");

    if (project.guide?.toString() === userId) role = "Guide";
    if (project.leader?.toString() === userId) role = "Leader";

    return {
      role,
      createdAt,
      id: project._id,
      name: project.name,
      icon: project.icon,
      status: project.status,
      progress: project.progress,
    };
  });

  return formattedProjects;
};

const getAllUserTeams = async (userId) => {
  const user = await users.findById(userId).select("teams").populate({
    path: "teams",
    select: "name createdAt icon progress status leader guide members",
  });
  if (!user) throw new Error("UnknownUser");

  const formattedTeams = user.teams.map((team) => {
    let role = "Member";

    const createdAt = moment(team.createdAt).format("DD/MM/YYYY");

    if (team.leader?.toString() === userId) role = "Guide";
    if (team.leader?.toString() === userId) role = "Leader";

    return {
      role,
      createdAt,
      id: team._id,
      name: team.name,
      icon: team.icon,
      status: team.status,
      progress: team.progress,
    };
  });

  return formattedTeams;
};

const getAllUserInvitations = async (userId) => {
  const user = await users
    .findById(userId)
    .select("invitations")
    .populate({
      path: "invitations",
      populate: {
        path: "from project",
        select: "username profilePic name",
      },
      select: "role status isRead message createdAt",
    });

  if (!user) throw new Error("UnknownUser");

  const formattedInvitations = user.invitations?.map((invitation) => ({
    ...invitation.toObject(),
    time: moment(invitation.createdAt).format("hh:mm A"),
    date: moment(invitation.createdAt).format("DD/MM/YYYY"),
  }));

  return formattedInvitations.sort((a, b) =>
    a.isRead !== b.isRead
      ? a.isRead
        ? 1
        : -1
      : new Date(b.createdAt) - new Date(a.createdAt)
  );
};

const getAllUserNotifications = async (userId) => {
  const user = await users
    .findById(userId)
    .select("notifications")
    .populate({
      path: "notifications",
      populate: { path: "from", select: "profilePic username" },
      select: "type message isRead createdAt",
    });

  if (!user) throw new Error("UnknownUser");

  const formattedNotifications = user.notifications.map((notification) => {
    return {
      ...notification.toObject(),
      time: moment(notification.createdAt).format("hh:mm A"),
      date: moment(notification.createdAt).format("DD/MM/YYYY"),
    };
  });

  return formattedNotifications.sort((a, b) =>
    a.isRead !== b.isRead
      ? a.isRead
        ? 1
        : -1
      : new Date(b.createdAt) - new Date(a.createdAt)
  );
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

const setInvitationAccepted = async (userId, invitationId) => {
  let projectActivity,
    previousGuideSocketId,
    notificationForProjectLeader,
    notificationForPreviousGuide;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invitation = await invitations.findById(invitationId);
    if (!invitation) throw new Error("UnknownInvitation");

    if (invitation.status === "accepted" || invitation.status === "rejected")
      throw new Error("InvitationAlreadyResponded");

    if (invitation.status === "expired")
      throw new Error("InvitationHasExpired");

    const { invitedUserId } = jwt.verify(
      invitation.authenticity,
      process.env.JWT_INVITATION_KEY
    );

    const project = await projects
      .findById(invitation.project)
      .select("name activities guide members invitations");

    const projectLeader = await users
      .findById(invitation.from)
      .select("notifications");

    const invitedUser = await users
      .findById(invitedUserId)
      .select("username projects profilePic");

    invitation.isRead = true;
    invitation.status = "accepted";

    if (invitation.role === "guide") {
      if (project.guide) {
        const previousGuide = await users
          .findById(project.guide)
          .select("notifications projects");

        previousGuideSocketId = connectedUsers[previousGuide.id];

        notificationForPreviousGuide = await notifications.create(
          [
            {
              to: previousGuide.id,
              from: invitedUser.id,
              type: "projectGuideDemotion",
              message: `${invitedUser.username} has replaced you as the guide for the project ${project.name}`,
            },
          ],
          { session }
        );

        previousGuide.notifications.push(notificationForPreviousGuide[0]._id);
        previousGuide.projects = previousGuide.projects.filter(
          (projectId) => projectId.toString() !== project._id.toString()
        );
        await previousGuide.save({ session });
      }
      project.guide = invitedUser._id;
    }

    if (invitation.role === "member") project.members.push(invitedUser._id);

    invitedUser.projects.push(project._id);

    projectActivity = await activities.create(
      [
        {
          entity: "project",
          project: project._id,
          image: invitedUser.profilePic,
          type: "projectCollaboratorJoined",
          message: `${invitedUser.username} has joined this project as a ${invitation.role}`,
          read_users: [
            {
              readBy: projectLeader.id,
              isRead: true,
            },
            { readBy: userId, isRead: true },
          ],
        },
      ],
      { session }
    );

    project.activities.push(projectActivity[0]._id);

    project.invitations = project.invitations.filter(
      (invitationId) => invitationId.toString() !== invitation._id.toString()
    );

    notificationForProjectLeader = await notifications.create(
      [
        {
          to: projectLeader.id,
          from: invitedUser.id,
          type: "projectInvitationAccepted",
          message: `${invitedUser.username} has accepted your invite to join the project ${project.name} as a ${invitation.role}`,
        },
      ],
      { session }
    );

    projectLeader.notifications.push(notificationForProjectLeader[0]._id);

    await Promise.all([
      project.save({ session }),
      invitation.save({ session }),
      invitedUser.save({ session }),
      projectLeader.save({ session }),
    ]);

    io.emit("projectActivities", projectActivity[0]._id);
    io.emit("notifications", notificationForProjectLeader[0]._id);
    io.emit("projectDetails", (project.id + invitation.id).toString());

    previousGuideSocketId &&
      io.to(previousGuideSocketId).emit("kickedFromProject", project._id);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const setInvitationRejected = async (userId, invitationId) => {
  let newNotification;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invitation = await invitations
      .findById(invitationId)
      .session(session);

    const { invitedUserId } = jwt.verify(
      invitation.authenticity,
      process.env.JWT_INVITATION_KEY
    );

    if (userId !== invitedUserId && userId !== invitation.to.toString())
      throw new Error("UnknownInvitation");

    if (invitation.status === "accepted" || invitation.status === "rejected")
      throw new Error("InvitationAlreadyResponded");

    if (invitation.status === "expired")
      throw new Error("InvitationHasExpired");

    invitation.status = "rejected";

    const projectLeader = await users
      .findById(invitation.from.toString())
      .select("notifications")
      .session(session);

    const invitedUser = await users
      .findById(invitedUserId)
      .select("username profilePic")
      .session(session);

    const project = await projects
      .findById(invitation.project.toString())
      .select("name")
      .session(session);

    newNotification = await notifications.create(
      [
        {
          from: invitedUser.id,
          to: projectLeader.id,
          type: "projectInvitationRejected",
          message: `${invitedUser.username} has rejected your invite to join the project ${project.name} as a ${invitation.role}.`,
        },
      ],
      { session }
    );

    invitation.isRead = true;
    projectLeader.notifications.push(newNotification[0]._id);

    await Promise.all([
      invitation.save({ session }),
      projectLeader.save({ session }),
    ]);

    io.emit("notifications", newNotification[0]?._id);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const setNotifications = async (userId) =>
  await notifications.updateMany({ to: userId }, { $set: { isRead: true } });

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
  getAllUserTeams,
  setNotifications,
  removeProfilePic,
  setPrimaryDetails,
  setContactDetails,
  getAllUserProjects,
  setSecurityDetails,
  setSecondaryDetails,
  getAllUserInvitations,
  setInvitationAccepted,
  setInvitationRejected,
  getAllUserNotifications,
};
