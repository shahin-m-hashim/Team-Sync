const bcrypt = require("bcrypt");
const moment = require("moment");
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
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  await user.populate("projects");

  const formattedProjects = user.projects.map(async (project) => {
    await project.populate("leader");
    await project.populate("guide");

    const { name, icon, leader, guide, createdAt, NOM, progress, status } =
      project;
    const formattedDate = moment(createdAt).format("DD/MM/YYYY");
    return {
      name,
      icon,
      leader: leader?.username,
      guide: guide?.username || "N/A",
      createdAt: formattedDate,
      NOM,
      progress,
      status,
    };
  });

  return { projects: await Promise.all(formattedProjects), total: user.NOP };
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
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  await user.populate("invitations");

  const formattedInvitations = user.invitations.map((invitation) => {
    const { authenticity, ...invitationData } = invitation._doc;
    return invitationData;
  });

  return { invitations: [...formattedInvitations], total: user.NOI };
};

const getAllUserNotifications = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");
  await user.populate("notifications");

  const formattedNotifications = user.notifications.map((notification) => {
    return notification.message;
  });

  return { notifications: [...formattedNotifications], total: user.NON };
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

const setInvitation = async (userId, inviteId, status) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invitation = await invitations.findById(inviteId).session(session);
    if (!invitation) throw new Error("UnknownInvitation");

    const { invitedUserId } = jwt.verify(
      invitation.authenticity,
      process.env.JWT_INVITATION_KEY
    );

    const project = await projects
      .findById(invitation.project.toString())
      .session(session);
    const projectLeader = await users
      .findById(invitation.invitedBy.toString())
      .session(session);
    const invitedUser = await users.findById(invitedUserId).session(session);

    if (
      userId !== invitedUserId &&
      userId !== invitation.invitedUser.toString()
    ) {
      throw new Error("UnknownInvitation");
    }

    if (invitation.status === "expired")
      throw new Error("InvitationHasExpired");

    if (status === "accept") {
      invitation.status = "accepted";

      if (invitation.role === "member") {
        project.members.push(userId);
      } else {
        project.guide = userId;
      }

      invitedUser.projects.push(project._id);

      const newActivity = await activities.create(
        [
          {
            type: "collaboratorJoined",
            message: `${invitedUser.username} has joined ${project.name} as a ${invitation.role}`,
            image: invitedUser.profilePic,
          },
        ],
        { session }
      );

      project.activities.push(newActivity[0]._id);

      const newNotification = await notifications.create(
        [
          {
            user: projectLeader.id,
            type: "projectInvitationAccepted",
            message: `${invitedUser.username} has accepted your invite to join ${project.name} as a ${invitation.role}`,
            image: invitedUser.profilePic,
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
            user: projectLeader.id,
            type: "projectInvitationRejected",
            message: `${invitedUser.username} has rejected your invite to join ${project.name} as a ${invitation.role}`,
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
