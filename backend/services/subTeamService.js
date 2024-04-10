const teams = require("../models/teamModel");
const subteams = require("../models/subTeamModel");
const notifications = require("../models/notificationModel");

// POST

// PATCH
const setSubTeamCollaborator = async (
  next,
  role,
  userId,
  username,
  subTeamId
) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const subTeam = await subteams
      .findById(subTeamId)
      .populate("parent")
      .session(session);
    if (!team) throw new Error("UnknownSubTeam");

    const team = await teams
      .findById(subTeam.parent.id)
      .populate("leader")
      .populate("members")
      .session(session);
    if (!project) throw new Error("UnknownTeam");

    const collaborator = team.members.find(
      (member) => member.username === username
    );
    if (!collaborator) throw new Error("UnknownUserFromTeam");

    if (
      subTeam.leader.equals(collaborator._id) ||
      subTeam.members.some((member) => member.equals(collaborator._id))
    )
      throw new Error("UserAlreadyInSubTeam");

    if (userId === subTeam.leader && role === "leader") {
      subTeam.members.push(userId);
      subTeam.leader = collaborator._id;
    }

    if (role === "leader") subTeam.leader = collaborator._id;

    if (role === "member") subTeam.members.push(collaborator._id);

    const notificationMessage = `You have been added as a ${role} by ${team.leader.username} in sub team ${subTeam.name} in team ${team.name}`;
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
