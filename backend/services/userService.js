const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const users = require("../models/userModel");
const projects = require("../models/projectModel");
const activities = require("../models/activityModel");
const invitations = require("../models/invitationModel");
const notifications = require("../models/notificationModel");

// GET
const getUserDetails = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  const {
    password,
    createdAt,
    updatedAt,
    used_otps,
    projects,
    NOP,
    teams,
    NOTe,
    subTeams,
    NOST,
    tasks,
    NOTa,
    invitations,
    NOI,
    notifications,
    NON,
    connections,
    NOC,
    __v,
    ...userData
  } = user._doc;
  return userData;
};

const getAllUserProjects = async (userId) => {
  const user = await users.findById(userId).populate({
    path: "projects",
    populate: { path: "leader guide" },
  });

  if (!user) throw new Error("UnknownUser");

  const formattedProjects = user.projects.map((project) => {
    let role = "Member";

    const createdAt = moment(project.createdAt).format("DD/MM/YYYY");

    if (project.leader?.id === userId) role = "Leader";
    else if (project.guide?.id === userId) role = "Guide";

    return { ...project._doc, role, createdAt };
  });

  return formattedProjects;
};

const getAllUserTeams = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");

  await user.populate("teams");

  const formattedTeams = user.teams.map(async (team) => {
    await team.populate("leader");
    await team.populate("guide");
    await team.populate("parent");

    const {
      name,
      icon,
      leader,
      guide,
      createdAt,
      NOM,
      parent,
      progress,
      status,
    } = team;

    const formattedDate = moment(createdAt).format("DD/MM/YYYY");

    return {
      name,
      icon,
      leader: leader?.username,
      guide: guide?.username || "N/A",
      parent: parent?.name,
      NOM,
      createdAt: formattedDate,
      status,
      progress,
    };
  });

  return { teams: await Promise.all(formattedTeams), total: user.NOTe };
};

const getAllUserSubTeams = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  await user.populate("subTeams");

  const formattedSubTeams = user.subTeams.map((subTeam) => {
    subTeam
      .populate("leader")
      .populate("guide")
      .populate("parent")
      .populate("grandParent");

    const {
      name,
      icon,
      leader,
      guide,
      createdAt,
      NOM,
      parent,
      grandParent,
      progress,
      status,
    } = subTeam;
    const formattedDate = moment(createdAt).format("DD/MM/YYYY");

    return {
      name,
      icon,
      createdAt: formattedDate,
      leader: leader.username,
      guide: guide.username,
      NOM,
      parent: parent.name,
      grandParent: grandParent.name,
      progress,
      status,
    };
  });

  return { subTeams: [...formattedSubTeams], total: user.NOST };
};

const getAllUserInvitations = async (userId) => {
  const user = await users
    .findById(userId)
    .select({
      invitations: 1,
    })
    .populate({
      path: "invitations",
      populate: {
        path: "from project",
        select: "username profilePic name -_id",
      },
      select: "role status isRead message createdAt",
    });

  if (!user) throw new Error("UnknownUser");

  const formattedInvitations = user.invitations?.map((invitation) => ({
    ...invitation.toObject(),
    time: moment(invitation.createdAt).format("hh:mm A"),
    date: moment(invitation.createdAt).format("DD/MM/YYYY"),
  }));

  return formattedInvitations;
};

const getAllUserNotifications = async (userId) => {
  const user = await users
    .findById(userId)
    .select({ notifications: 1 })
    .populate({
      path: "notifications",
      populate: { path: "from", select: "profilePic username -_id" },
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

  return formattedNotifications;
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

const setInvitation = async (userId, invitationId, status) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invitation = await invitations
      .findById(invitationId)
      .session(session);
    if (!invitation || invitation.to.toString() !== userId)
      throw new Error("UnknownInvitation");

    if (invitation.status === "accepted" || invitation.status === "rejected")
      throw new Error("InvitationAlreadyResponded");

    if (invitation.status === "expired")
      throw new Error("InvitationHasExpired");

    const { invitedUserId } = jwt.verify(
      invitation.authenticity,
      process.env.JWT_INVITATION_KEY
    );

    const project = await projects
      .findById(invitation.project.toString())
      .session(session);

    const projectLeader = await users
      .findById(invitation.from.toString())
      .session(session);

    const invitedUser = await users.findById(invitedUserId).session(session);

    if (userId !== invitedUserId && userId !== invitation.to.toString()) {
      throw new Error("UnknownInvitation");
    }

    if (status === "accept") {
      invitation.status = "accepted";

      if (invitation.role === "member") {
        project.members.push(invitedUser._id);
      } else {
        project.guide = userId;
      }

      invitedUser.projects.push(project._id);

      const newActivity = await activities.create(
        [
          {
            project: project._id,
            type: "collaboratorJoined",
            message: `${invitedUser.username} has joined this project ${project.name} as a ${invitation.role}`,
            image: invitedUser.profilePic,
          },
        ],
        { session }
      );

      project.activities.push(newActivity[0]._id);

      const newNotification = await notifications.create(
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

      projectLeader.notifications.push(newNotification[0]._id);
    }

    if (status === "reject") {
      invitation.status = "rejected";
      const newNotification = await notifications.create(
        [
          {
            from: invitedUser.id,
            to: projectLeader.id,
            type: "projectInvitationRejected",
            message: `${invitedUser.username} has rejected your invite to join the project ${project.name} as a ${invitation.role}`,
            image: invitedUser.profilePic,
          },
        ],
        { session }
      );
      projectLeader.notifications.push(newNotification[0]._id);
    }

    invitation.isRead = true;

    await Promise.all([
      invitation.save({ session }),
      invitedUser.save({ session }),
      projectLeader.save({ session }),
      project.save({ session }),
    ]);

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
  setInvitation,
  setProfilePic,
  getUserDetails,
  getAllUserTeams,
  setNotifications,
  removeProfilePic,
  setPrimaryDetails,
  setContactDetails,
  getAllUserProjects,
  getAllUserSubTeams,
  setSecurityDetails,
  setSecondaryDetails,
  getAllUserInvitations,
  getAllUserNotifications,
};
