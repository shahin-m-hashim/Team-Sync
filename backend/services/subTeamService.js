const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const subteams = require("../models/subTeamModel");
const activities = require("../models/activityModel");
const notifications = require("../models/notificationModel");

// POST
const setSubTeamCollaborator = async (userId, subTeamId, username, role) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const subTeam = await subteams
      .findById(subTeamId)
      .populate("members")
      .populate("grandParent")
      .session(session);

    if (!subTeam) throw new Error("UnknownSubTeam");

    const team = await teams
      .findById(subTeam.parent.toString())
      .populate("subTeams")
      .populate("members")
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    const previousLeader = await users
      .findById(subTeam.leader.toString())
      .session(session);

    const collaborator = team.members?.find(
      (member) => member.username === username
    );

    if (!collaborator) throw new Error("UnknownUserFromTeam");

    if (
      team.subTeams?.some((subTeam) => subTeam.leader?.equals(collaborator._id))
    )
      throw new Error("UserAlreadyInAnotherSubTeamAsLeader");

    if (team.unavailableMembers?.includes(collaborator.username))
      throw new Error("UserAlreadyInAnotherSubTeam");

    if (
      subTeam.leader?.equals(collaborator._id) ||
      subTeam.guide?.equals(collaborator._id) ||
      subTeam.members?.some((member) => member.equals(collaborator._id))
    )
      throw new Error("UserAlreadyInSubTeam");

    if (role === "leader") {
      previousLeader.subTeams = previousLeader.subTeams.filter(
        (subTeam) => subTeam.toString() !== subTeamId
      );

      subTeam.leader = collaborator._id;

      const notificationMessageForLeader = `You are no longer the leader of the sub team ${subTeam.name} in team ${team.name} in project ${subTeam.grandParent?.name}.`;
      const newNotificationForLeader = await notifications.create(
        [
          {
            user: userId,
            type: "subTeamLeaderDemotion",
            message: notificationMessageForLeader,
            isRead: false,
          },
        ],
        { session }
      );

      subTeam.leader?.notifications?.push(newNotificationForLeader[0]._id);

      const notificationMessage = `You have been promoted as the leader of the team ${subTeam.name} in team ${team.name} in project ${subTeam.grandParent?.name} by the previous sub team leader ${previousLeader.username}.`;
      const newNotification = await notifications.create(
        [
          {
            user: collaborator._id,
            type: "subTeamLeaderPromotion",
            message: notificationMessage,
            isRead: false,
          },
        ],
        { session }
      );

      collaborator.subTeams?.push(subTeam._id);
      collaborator.notifications?.push(newNotification[0]._id);

      const activityMsg = `${username} have been promoted as the current leader of this sub team ${subTeam.name} by the previous leader ${previousLeader.username}.`;

      const newActivity = await activities.create(
        [
          {
            type: "subTeamLeaderChanged",
            message: activityMsg,
            image: subTeam.icon,
          },
        ],
        { session }
      );

      subTeam.activities.push(newActivity[0]._id);
    } else if (role === "member") {
      subTeam.members.push(collaborator._id);

      const notificationMessage = `You have been added as a member in sub team ${subTeam.name} in team ${team.name} in project ${subTeam.grandParent?.name} by leader ${subTeam.leader.username}.`;
      const newNotification = await notifications.create(
        [
          {
            user: collaborator._id,
            type: "addedAsSubTeamCollaborator",
            message: notificationMessage,
            isRead: false,
          },
        ],
        { session }
      );

      collaborator.subTeams?.push(subTeam._id);
      collaborator.notifications?.push(newNotification[0]._id);

      const activityMsg = `${username} have been added as a member in this sub team ${subTeam.name} by leader ${subTeam.leader.username}`;

      const newActivity = await activities.create(
        [
          {
            type: "subTeamCollaboratorAdded",
            message: activityMsg,
            image: subTeam.icon,
          },
        ],
        { session }
      );

      subTeam.activities?.push(newActivity[0]._id);
      team.unavailableMembers.push(collaborator.username);
    } else {
      throw new Error("InvalidRole");
    }

    await Promise.all([
      collaborator.save({ session }),
      previousLeader.save(),
      subTeam.save({ session }),
      team.save({ session }),
    ]);

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

// PATCH
const setSubTeamDetails = async (subTeamId, newTeamDetails) => {
  const subTeam = await subteams.findById(subTeamId);
  if (!subTeam) throw new Error("UnknownSubTeam");
  const { name, description } = newSubTeamDetails;
  subTeam.name = name;
  subTeam.description = description;
  await subTeam.save();
};

const setSubTeamIcon = async (subTeamId, newTeamIcon) => {
  const subTeam = await subteams.findById(subTeamId);
  if (!subTeam) throw new Error("UnknownSubTeam");
  subTeam.icon = newSubTeamIcon;
  await subTeam.save();
  return subTeam.icon;
};

module.exports = {
  setSubTeamIcon,
  setSubTeamDetails,
  setSubTeamCollaborator,
};
