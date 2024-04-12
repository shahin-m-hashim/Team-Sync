const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const subteams = require("../models/subTeamModel");
const activities = require("../models/activityModel");
const notifications = require("../models/notificationModel");

// POST
const createTeamCollaborator = async (userId, teamId, username, role) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const team = await teams
      .findById(teamId)
      .session(session)
      .populate("leader")
      .populate("members")
      .populate({ path: "parent", populate: "leader members" });

    if (!team) throw new Error("UnknownTeam");

    const project = team.parent;

    const collaborator = project.members.find(
      (member) => member.username === username
    );

    if (!collaborator) throw new Error("UnknownUserFromProject");

    if (
      team.leader.equals(collaborator._id) ||
      team.guide.equals(collaborator._id) ||
      team.members.some((member) => member.equals(collaborator._id))
    )
      throw new Error("UserAlreadyInTeam");

    if (role === "leader") {
      team.members.push(userId);
      team.leader = collaborator._id;

      const notificationMessageForLeader = `You are no longer the leader of the team ${team.name} in project ${project.name}`;
      const newNotificationForLeader = await notifications.create(
        [
          {
            type: "teamLeaderDemotion",
            message: notificationMessageForLeader,
            isRead: false,
          },
        ],
        { session }
      );

      team.leader.notifications.push(newNotificationForLeader[0]._id);

      const notificationMessage = `You have been promoted as a leader in team ${team.name} by its previous leader ${team.leader.username} within project ${project.name}`;
      const newNotification = await notifications.create(
        [
          {
            type: "teamLeaderPromotion",
            message: notificationMessage,
            isRead: false,
          },
        ],
        { session }
      );

      collaborator.notifications.push(newNotification[0]._id);

      const activityMsg = `${username} have been promoted as the current leader of the team ${team.name} by the its previous leader ${team.leader.username} within project ${project.name}`;

      const newActivity = await activities.create(
        [
          {
            project: project.id,
            type: "teamLeaderChanged",
            message: activityMsg,
          },
        ],
        { session }
      );

      project.activities.push(newActivity[0]._id);
    }

    if (role === "member") {
      team.members.push(collaborator._id);

      const notificationMessage = `You have been added as a member by ${team.leader.username} in team ${team.name} by its leader ${team.leader.username} within project ${project.name}`;
      const newNotification = await notifications.create(
        [
          {
            type: "addedAsTeamCollaborator",
            message: notificationMessage,
            isRead: false,
          },
        ],
        { session }
      );

      collaborator.notifications.push(newNotification[0]._id);
      collaborator.teams.push(team._id);

      const activityMsg = `${username} have been added as a member by ${team.leader.username} in team ${team.name} in project ${project.name}`;

      const newActivity = await activities.create(
        [
          {
            project: project.id,
            type: "addedTeamCollaborator",
            message: activityMsg,
          },
        ],
        { session }
      );

      project.activities.push(newActivity[0]._id);
    }

    await Promise.all([
      collaborator.save({ session }),
      team.save({ session }),
      project.save({ session }),
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

const createSubTeam = async (userId, teamId, subTeamDetails) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const user = await users.findById(userId).session(session);
    if (!user) throw new Error("UnknownUser");

    const team = await teams
      .findById(teamId)
      .populate("parent")
      .populate("leader")
      .session(session);
    if (!team) throw new Error("UnknownTeam");

    const newSubTeam = await subteams.create(
      [
        {
          ...subTeamDetails,
          grandParent: team.parent,
          parent: teamId,
          leader: userId,
          guide: team.guide,
        },
      ],
      { session }
    );

    user.subTeams.push(newSubTeam[0]._id);
    team.subTeams.push(newSubTeam[0]._id);

    const newActivity = await activities.create(
      [
        {
          project: team.parent.id,
          type: "subTeamAdded",
          message: `A new sub team ${newSubTeam[0].name} is added to team ${team.name} in project ${team.parent.name} by team leader ${team.leader.username}`,
        },
      ],
      { session }
    );

    team.parent.activities.push(newActivity[0]._id);

    await Promise.all([user.save({ session }), team.parent.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    return newSubTeam[0]._id;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

// PATCH
const setTeamDetails = async (teamId, newTeamDetails) => {
  const team = await teams.findById(teamId);
  if (!team) throw new Error("UnknownTeam");
  const { name, description } = newTeamDetails;
  team.name = name;
  team.description = description;
  await team.save();
};

const setTeamIcon = async (teamId, newTeamIcon) => {
  const team = await teams.findById(teamId);
  if (!team) throw new Error("UnknownTeam");
  team.icon = newTeamIcon;
  await team.save();
  return team.icon;
};

module.exports = {
  setTeamIcon,
  createSubTeam,
  setTeamDetails,
  createTeamCollaborator,
};
