const users = require("../models/userModel");
const teams = require("../models/teamModel");
const projects = require("../models/projectModel");
const subteams = require("../models/subTeamModel");
const notifications = require("../models/notificationModel");

// POST
const createSubTeam = async (userId, teamId, subTeamDetails) => {
  const user = await users.findById(userId);
  if (!user) throw new Error("UnknownUser");

  const team = await teams.findById(teamId);
  if (!team) throw new Error("UnknownTeam");

  const newSubTeam = await subteams.create({
    ...subTeamDetails,
    leader: userId,
    parent: teamId,
    guide: team.guide,
  });

  user.subTeams.push(newSubTeam._id);
  teams.subTeams.push(newSubTeam._id);

  await user.save();
  await teams.save();
  return newTeam._id;
};

// PATCH
const setTeamCollaborator = async (userId, teamId, username, role, next) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const team = await teams
      .findById(teamId)
      .populate("parent")
      .session(session);
    if (!team) throw new Error("UnknownTeam");

    const project = await projects
      .findById(team.parent.id)
      .populate("leader")
      .populate("members")
      .session(session);
    if (!project) throw new Error("UnknownProject");

    const collaborator = project.members.find(
      (member) => member.username === username
    );
    if (!collaborator) throw new Error("UnknownUserFromProject");

    if (
      team.leader.equals(collaborator._id) ||
      team.members.some((member) => member.equals(collaborator._id))
    )
      throw new Error("UserAlreadyInTeam");

    if (userId === team.leader && role === "leader") {
      team.members.push(userId);
      team.leader = collaborator._id;
    }

    if (role === "leader") team.leader = collaborator._id;

    if (role === "member") team.members.push(collaborator._id);

    const notificationMessage = `You have been added as a ${role} by ${project.leader.username} in team ${team.name} in project ${project.name}`;
    const newNotification = await notifications.create(
      {
        type: "addCollaborator",
        message: notificationMessage,
        isRead: false,
      },
      { session }
    );

    collaborator.notifications.push(newNotification._id);
    collaborator.teams.push(team._id);

    await Promise.all([collaborator.save({ session }), team.save({ session })]);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    if (error.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = error.errors;
      next(customError);
    } else {
      next(error);
    }
  }
};

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
