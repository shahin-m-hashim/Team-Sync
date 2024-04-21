const moment = require("moment");
const { io } = require("../server");
const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const subteams = require("../models/subTeamModel");
const projects = require("../models/projectModel");
const activities = require("../models/activityModel");
const notifications = require("../models/notificationModel");

// GET
const getTeamDetails = async (teamId) => {
  let collaborators = [];

  const team = await teams
    .findById(teamId)
    .select("icon name description leader guide members NOC")
    .populate({
      path: "leader guide members",
      select: "username profilePic id",
    });

  if (!team) throw new Error("UnknownProject");

  collaborators.push({
    id: team.leader?.id,
    role: "Leader",
    username: team.leader?.username,
    profilePic: team.leader?.profilePic,
  });

  team.guide &&
    collaborators.push({
      id: team.guide?.id,
      role: "Guide",
      username: team.guide?.username,
      profilePic: team.guide?.profilePic,
    });

  team.members &&
    team.members.forEach((member) => {
      collaborators.push({
        id: member.id,
        role: "Member",
        username: member?.username,
        profilePic: member?.profilePic,
      });
    });

  return {
    icon: team.icon,
    name: team.name,
    description: team.description,
    NOC: team.NOC,
    collaborators,
  };
};

const getTeamMembers = async (teamId) => {
  const teamMembers = await teams
    .findById(teamId)
    .select("members -_id")
    .populate({
      path: "members",
      select: "username profilePic tag fname",
    });
  if (!teamMembers) throw new Error("UnknownTeam");

  return teamMembers;
};

const getTeamActivities = async (teamId) => {
  const team = await teams.findById(teamId).select("activities").populate({
    path: "activities",
    select: "-type -__v -updatedAt",
  });

  if (!team) throw new Error("UnknownTeam");

  const formattedTeamActivities = team.activities.map((activity) => {
    return {
      ...activity.toObject(),
      time: moment(activity.createdAt).format("hh:mm A"),
      date: moment(activity.createdAt).format("DD/MM/YYYY"),
    };
  });

  return formattedTeamActivities;
};

const getTeamSubTeams = async (teamId, userId) => {
  const team = await teams.findById(teamId).select("subTeams").populate({
    path: "subTeams",
    select:
      "parent grandParent name createdAt icon progress status leader guide members",
  });
  if (!team) throw new Error("UnknownSubTeam");

  const formattedSubTeams = team.subTeams.map((subTeam) => {
    let role = "Member";

    const createdAt = moment(subTeam.createdAt).format("DD/MM/YYYY");

    if (subTeam.guide?.toString() === userId) role = "Guide";
    if (subTeam.leader?.toString() === userId) role = "Leader";

    return {
      role,
      createdAt,
      id: subTeam._id,
      name: subTeam.name,
      icon: subTeam.icon,
      parent: subTeam.parent,
      status: subTeam.status,
      progress: subTeam.progress,
      grandParent: subTeam.grandParent,
    };
  });

  return formattedSubTeams;
};

// POST
const setTeamCollaborator = async (userId, teamId, username, role) => {
  let session = null;
  let newActivity = null;
  let newNotification = null;
  let newNotificationForLeader = null;

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

    if (team.guide?.equals(collaborator._id)) {
      throw new Error("UserAlreadyInTeamAsAGuide");
    }

    if (team.members?.some((member) => member.equals(collaborator._id))) {
      throw new Error("UserAlreadyInTeamAsMember");
    }

    if (role === "leader") {
      previousLeader.teams = previousLeader.teams.filter(
        (team) => team.toString() !== teamId
      );

      team.leader = collaborator._id;

      const notificationMessageForLeader = `You are no longer the leader of the team ${team.name} in project ${project.name}.`;
      newNotificationForLeader = await notifications.create(
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
      newNotification = await notifications.create(
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

      const activityMsg = `${username} have been promoted as the current leader of this team by the previous leader ${previousLeader.username}.`;

      newActivity = await activities.create(
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
      previousLeader.save({ session }),
      team.save({ session }),
    ]);

    io.emit(
      "notifications",
      newNotification[0]._id + newNotificationForLeader[0]._id
    );

    io.emit("activities", newActivity[0]._id);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.log(error);

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
          entity: "team",
          type: "subTeamAddedToTeam",
          image: newSubTeam[0].icon,
          message: `A new sub team ${newSubTeam[0].name} is added to this team by leader ${team.leader.username}`,
        },
      ],
      { session }
    );

    team.activities.push(newActivity[0]._id);

    await Promise.all([user.save({ session }), team.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    io.emit("subTeams", newSubTeam[0]._id);
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
const setTeamDetails = async (teamId, updatedTeamDetails) => {
  const team = await teams.findById(teamId);
  if (!team) throw new Error("UnknownTeam");
  const { name, description } = updatedTeamDetails;
  team.name = name;
  team.description = description;
  await team.save();

  io.emit("teams", (team.id + team.updatedAt).toString());
};

const setTeamIcon = async (teamId, updatedTeamIcon) => {
  const team = await teams.findById(teamId);
  if (!team) throw new Error("UnknownTeam");
  team.icon = updatedTeamIcon;
  await team.save();

  io.emit("teams", (team.id + team.updatedAt).toString());

  return team.icon;
};

// DELETE
const removeTeamIcon = async (teamId) => {
  const team = await teams.findById(teamId);
  if (!team) throw new Error("UnknownTeam");
  team.icon = "";
  await team.save();

  io.emit("teams", (team.id + team.updatedAt).toString());
};

const removeTeamCollaborator = async (teamId, collaboratorUsername, role) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const collaborator = await users
      .findOne({ username: collaboratorUsername })
      .session(session);
    if (!collaborator) throw new Error("UnknownUser");

    const team = await teams
      .findById(teamId)
      .populate({
        path: "leader guide members invitations",
        select: "username project",
      })
      .session(session);
    if (!team) throw new Error("UnknownTeam");

    let notificationMessage = "";
    if (role === "guide" && team.guide?.username === collaboratorUsername) {
      team.guide = null;
      collaborator.projects = collaborator.projects.pull(projectId);
      project.invitations = project.invitations.filter(
        (invitation) =>
          invitation.project.toString() !== projectId ||
          invitation.to.toString() !== collaborator._id.toString()
      );

      notificationMessage = `You are no longer a guide of the project ${project.name}.`;
    } else if (
      role === "member" &&
      project.members?.some(
        (member) => member.username === collaboratorUsername
      )
    ) {
      project.members.pull(collaborator._id);
      collaborator.projects = collaborator.projects.pull(projectId);
      project.invitations = project.invitations.filter(
        (invitation) =>
          invitation.project.toString() !== projectId ||
          invitation.to.toString() !== collaborator._id.toString()
      );

      notificationMessage = `You are no longer a member of the project ${project.name}.`;

      const newActivity = await activities.create(
        [
          {
            entity: "team",
            image: collaborator.profilePic,
            type: "teamCollaboratorRemoved",
            message: `${collaboratorUsername} who was a ${role} of this team was removed by its leader ${project.leader?.username}`,
          },
        ],
        { session }
      );
      project.activities.push(newActivity[0]._id);
    } else {
      throw new Error("UnknownCollaborator");
    }

    const newNotification = await notifications.create(
      [
        {
          from: project.leader,
          to: collaborator.id,
          type: "kickedFromProject",
          message: notificationMessage,
          isRead: false,
        },
      ],
      { session }
    );

    collaborator.notifications.push(newNotification[0]._id);

    await Promise.all([
      project.save({ session }),
      collaborator.save({ session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    io.emit("project", (project.id + project.updatedAt).toString());
    io.emit("notification", newNotification[0]._id);
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

module.exports = {
  setTeamIcon,
  createSubTeam,
  createSubTeam,
  getTeamDetails,
  setTeamDetails,
  removeTeamIcon,
  getTeamMembers,
  getTeamSubTeams,
  getTeamActivities,
  setTeamCollaborator,
  removeTeamCollaborator,
};
