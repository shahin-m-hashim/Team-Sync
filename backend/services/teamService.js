const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const subteams = require("../models/subTeamModel");
const projects = require("../models/projectModel");
const activities = require("../models/activityModel");
const notifications = require("../models/notificationModel");

// POST
const setTeamCollaborator = async (userId, teamId, username, role) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const team = await teams
      .findById(teamId)
      .session(session)
      .populate("members");

    if (!team) throw new Error("UnknownTeam");

    const project = await projects
      .findById(team.parent.toString())
      .populate("teams")
      .populate("members")
      .session(session);

    if (!project) throw new Error("UnknownProject");

    const previousLeader = await users
      .findById(team.leader.toString())
      .session(session);

    const collaborator = project.members?.find(
      (member) => member.username === username
    );

    if (!collaborator) throw new Error("UnknownUserFromProject");

    if (project.teams?.some((team) => team.leader?.equals(collaborator._id)))
      throw new Error("UserAlreadyInAnotherTeamAsLeader");

    if (project.unavailableMembers?.includes(collaborator.username))
      throw new Error("UserAlreadyInAnotherTeam");

    if (
      team.leader?.equals(collaborator._id) ||
      team.guide?.equals(collaborator._id) ||
      team.members?.some((member) => member.equals(collaborator._id))
    )
      throw new Error("UserAlreadyInTeam");

    if (role === "leader") {
      previousLeader.teams = previousLeader.teams.filter(
        (team) => team.toString() !== teamId
      );

      team.leader = collaborator._id;

      const notificationMessageForLeader = `You are no longer the leader of the team ${team.name} in project ${project.name}.`;
      const newNotificationForLeader = await notifications.create(
        [
          {
            user: userId,
            type: "teamLeaderDemotion",
            message: notificationMessageForLeader,
          },
        ],
        { session }
      );

      team.leader?.notifications?.push(newNotificationForLeader[0]._id);

      const notificationMessage = `You have been promoted as the leader of the team ${team.name} in project ${project.name} by the previous team leader ${previousLeader.username}.`;
      const newNotification = await notifications.create(
        [
          {
            user: collaborator._id,
            type: "teamLeaderPromotion",
            message: notificationMessage,
            isRead: false,
          },
        ],
        { session }
      );

      collaborator.teams?.push(team._id);
      collaborator.notifications?.push(newNotification[0]._id);

      const activityMsg = `${username} have been promoted as the current leader of this team ${team.name} by the previous leader ${previousLeader.username}.`;

      const newActivity = await activities.create(
        [
          {
            type: "teamLeaderChanged",
            message: activityMsg,
            image: team.icon,
          },
        ],
        { session }
      );

      team.activities.push(newActivity[0]._id);
    } else if (role === "member") {
      team.members.push(collaborator._id);

      const notificationMessage = `You have been added as a member in team ${team.name} in project ${project.name} by team leader ${team.leader.username}.`;
      const newNotification = await notifications.create(
        [
          {
            user: collaborator._id,
            type: "addedAsTeamCollaborator",
            message: notificationMessage,
            isRead: false,
          },
        ],
        { session }
      );

      collaborator.teams?.push(team._id);
      collaborator.notifications?.push(newNotification[0]._id);

      const activityMsg = `${username} have been added as a member in this team ${team.name} by leader ${team.leader.username}`;

      const newActivity = await activities.create(
        [
          {
            type: "teamCollaboratorAdded",
            message: activityMsg,
            image: team.icon,
          },
        ],
        { session }
      );

      team.activities?.push(newActivity[0]._id);
      project.unavailableMembers.push(collaborator.username);
    } else {
      throw new Error("InvalidRole");
    }

    await Promise.all([
      collaborator.save({ session }),
      previousLeader.save(),
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
          message: `A new sub team ${newSubTeam[0].name} is added to this team ${team.name} by leader ${team.leader.username}`,
        },
      ],
      { session }
    );

    team.activities.push(newActivity[0]._id);

    await Promise.all([user.save({ session }), team.save({ session })]);

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
  setTeamCollaborator,
};
