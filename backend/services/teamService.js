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
const getTeam = async (teamId) => {
  const team = await teams
    .findById(teamId)
    .select("icon name description leader guide members NOM")
    .populate({ path: "leader guide members", select: "username profilePic" });

  if (!team) throw new Error("UnknownTeam");

  return team;
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
    select: "parent name createdAt icon progress status leader guide members",
  });
  if (!team) throw new Error("UnknownTeam");

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

const getTeamSettings = async (teamId) => {
  const team = await teams
    .findById(teamId)
    .select("icon name description leader guide members parent")
    .populate({
      path: "leader guide members",
      select: "username profilePic",
    })
    .populate({
      path: "parent",
      select: "members",
      populate: {
        path: "members",
        select: "username fname profilePic tag",
      },
    });

  if (!team) throw new Error("UnknownTeam");

  const collaborators = [
    {
      role: "Leader",
      id: team.leader?._id,
      username: team.leader?.username,
      profilePic: team.leader?.profilePic,
    },
    ...team.members.map((member) => ({
      role: "Member",
      id: member._id,
      username: member.username,
      profilePic: member.profilePic,
    })),
  ];

  if (team.guide) {
    collaborators.push({
      role: "Guide",
      id: team.guide?._id,
      username: team.guide?.username,
      profilePic: team.guide?.profilePic,
    });
  }

  return {
    collaborators,
    icon: team.icon,
    name: team.name,
    NOC: collaborators.length,
    guide: team.guide?.username,
    description: team.description,
    leader: team.leader?.username,
    parentMembers: team.parent?.members,
  };
};

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
      team.save({ session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    io.emit(
      "notifications",
      newNotification[0]._id + newNotificationForLeader[0]._id
    );

    io.emit("activities", newActivity[0]._id);
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
          team: team.parent.id,
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

const removeTeamCollaborator = async (
  role,
  projectId,
  collaboratorUsername
) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const collaborator = await users
      .findOne({ username: collaboratorUsername })
      .session(session);
    if (!collaborator) throw new Error("UnknownUser");

    const project = await projects
      .findById(projectId)
      .populate({
        path: "leader guide members invitations",
        select: "username to project",
      })
      .session(session);
    if (!project) throw new Error("UnknownProject");

    console.log("Project\n", project);

    let notificationMessage = "";
    if (role === "guide" && project.guide?.username === collaboratorUsername) {
      project.guide = null;
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
            project: projectId,
            type: "collaboratorRemoved",
            message: `${collaboratorUsername} who was a ${role} of this project was removed by its leader ${project.leader?.username}`,
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
  getTeam,
  setTeamIcon,
  createSubTeam,
  createSubTeam,
  setTeamDetails,
  removeTeamIcon,
  setTeamDetails,
  getTeamSubTeams,
  getTeamSettings,
  getTeamActivities,
  setTeamCollaborator,
  removeTeamCollaborator,
};
