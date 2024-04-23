const moment = require("moment");
const { io } = require("../server");
const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const projects = require("../models/projectModel");
const subteams = require("../models/subTeamModel");
const activities = require("../models/activityModel");
const notifications = require("../models/notificationModel");

// GET
const getTeamDetails = async (teamId) => {
  let collaborators = [];

  const team = await teams
    .findById(teamId)
    .select("icon name description leader guide members NOM")
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
    collaborators,
    icon: team.icon,
    name: team.name,
    description: team.description,
    NOC: team.NOM + (team.guide ? 1 : 0) + 1,
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

const getTeamActivities = async (userId, teamId) => {
  const team = await teams.findById(teamId).select("activities").populate({
    path: "activities",
    select: "-type -__v -updatedAt",
  });

  if (!team) throw new Error("UnknownTeam");

  const formattedTeamActivities = team.activities.map((activity) => {
    const currentUserReadStatus = activity.read_users.find(
      (readUser) => readUser.readBy.toString() === userId
    );

    return {
      id: activity._id,
      image: activity.image,
      message: activity.message,
      createdAt: activity.createdAt,
      time: moment(activity.createdAt).format("hh:mm A"),
      date: moment(activity.createdAt).format("DD/MM/YYYY"),
      isRead: currentUserReadStatus ? currentUserReadStatus.isRead : false,
    };
  });

  return formattedTeamActivities.sort((a, b) =>
    a.isRead !== b.isRead
      ? a.isRead
        ? 1
        : -1
      : new Date(b.createdAt) - new Date(a.createdAt)
  );
};

const getTeamSubTeams = async (teamId, userId) => {
  const team = await teams.findById(teamId).select("subTeams").populate({
    path: "subTeams",
    select:
      "parent grandParent name createdAt icon progress status leader guide members",
  });
  if (!team) throw new Error("UnknownSubTeam");

  const formattedSubTeams = team.subTeams.map((subTeam) => {
    let role = "Collaborator";

    const createdAt = moment(subTeam.createdAt).format("DD/MM/YYYY");

    if (subTeam.guide?.toString() === userId) role = "Guide";
    if (subTeam.leader?.toString() === userId) role = "Leader";
    if (team.members?.some((member) => member.toString() === userId))
      role = "Member";

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
const createTeamMember = async (teamId, newMemberUsername) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const team = await teams
      .findById(teamId)
      .select("name parent leader guide members activities")
      .populate({
        path: "leader guide members",
        select: "username",
      })
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    const newMember = await users
      .findOne({ username: newMemberUsername })
      .select("username notifications teams profilePic")
      .session(session);

    if (!newMember) throw new Error("UnknownUser");

    if (team.guide?.username === newMemberUsername)
      throw new Error("UserAlreadyInTeamAsGuide");

    if (team.members?.some((member) => member.equals(newMember.id)))
      throw new Error("UserAlreadyInTeamAsMember");

    const project = await projects
      .findById(team.parent)
      .select("name unavailableMembers")
      .session(session);

    if (!project) throw new Error("UnknownProject");

    if (project.unavailableMembers.includes(newMemberUsername))
      throw new Error("UserAlreadyInAnotherTeam");

    team.members.push(newMember.id);
    newMember.teams.push(team.id);

    const notificationMessageForNewMember = `You have been added as a member in the team ${team.name} in project ${project.name} by the team leader ${team.leader.username}.`;

    const notificationForNewMember = await notifications.create(
      [
        {
          to: newMember.id,
          from: team.leader.id,
          type: "addedAsTeamMember",
          message: notificationMessageForNewMember,
        },
      ],
      { session }
    );

    newMember.notifications.push(notificationForNewMember[0]._id);

    const newTeamActivity = await activities.create([
      {
        team: teamId,
        entity: "team",
        type: "teamMemberAdded",
        image: newMember.profilePic,
        message: `${newMember.username} has been added as a member by the team leader ${team.leader.username}.`,
        read_users: [
          { readBy: newMember.id, isRead: true },
          { readBy: team.leader.id, isRead: true },
        ],
      },
    ]);

    team.activities.push(newTeamActivity[0]._id);

    project.unavailableMembers.push(newMemberUsername);

    await Promise.all([
      team.save({ session }),
      project.save({ session }),
      newMember.save({ session }),
    ]);

    io.emit("teamActivities", newTeamActivity[0]._id);
    io.emit("notifications", notificationForNewMember[0]._id);
    io.emit("teamDetails", (teamId + team.updatedAt).toString());

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

    const user = await users
      .findById(userId)
      .select("subTeams")
      .session(session);
    if (!user) throw new Error("UnknownUser");

    const team = await teams
      .findById(teamId)
      .select("parent leader guide subTeams activities")
      .populate({
        path: "leader",
        select: "username",
      })
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
          team: teamId,
          type: "subTeamAddedToTeam",
          image: newSubTeam[0].icon,
          message: `A new sub team ${newSubTeam[0].name} is added to this team by leader ${team.leader.username}`,
          read_users: [{ readBy: userId, isRead: true }],
        },
      ],
      { session }
    );

    team.activities.push(newActivity[0]._id);

    await Promise.all([user.save({ session }), team.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    io.emit("subTeams", newSubTeam[0]._id);
    io.emit("teamActivities", newActivity[0]._id);
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
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const team = await teams
      .findById(teamId)
      .select("parent name description icon leader")
      .populate({
        path: "leader",
        select: "username",
      })
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    const { name, description } = updatedTeamDetails;

    const previousTeamName = team.name;

    const project = await projects
      .findById(team.parent)
      .select("activities")
      .session(session);
    if (!project) throw new Error("UnknownProject");

    team.name = name;
    team.description = description;

    const newActivity = await activities.create(
      [
        {
          project: project.id,
          entity: "project",
          image: team.icon,
          type: "teamUpdatedInProject",
          message: `The team ${previousTeamName} is updated to ${team.name} by its leader ${team.leader.username}.`,
          read_users: [{ readBy: team.leader.id, isRead: true }],
        },
      ],
      { session }
    );

    project.activities.push(newActivity[0].id);

    await Promise.all([team.save({ session }), project.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    io.emit("projectActivities", newActivity[0].id);
    io.emit("teams", (team.id + team.updatedAt).toString());
    io.emit("teamDetails", (team.id + team.updatedAt).toString());
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const setTeamLeader = async (teamId, currentLeaderId, newLeaderUsername) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const team = await teams
      .findById(teamId)
      .select("name icon parent activities leader members guide")
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    const newLeader = await users
      .findOne({ username: newLeaderUsername })
      .select("notifications teams profilePic")
      .session(session);

    if (!newLeader) throw new Error("UnknownUser");

    if (team.guide?.username === newLeaderUsername)
      throw new Error("UserAlreadyInTeamAsGuide");

    if (team.members?.some((member) => member.equals(newLeader.id)))
      throw new Error("UserAlreadyInTeamAsMember");

    let project = await projects
      .findById(team.parent)
      .select("name unavailableMembers")
      .session(session);

    if (!project) throw new Error("UnknownProject");

    if (project.unavailableMembers.includes(newLeaderUsername))
      throw new Error("UserAlreadyInAnotherTeam");

    const currentLeader = await users
      .findById(currentLeaderId)
      .select("username notifications teams")
      .session(session);

    if (!currentLeader) throw new Error("UnknownUser");

    currentLeader.teams = currentLeader.teams.filter(
      (team) => team.toString() !== teamId
    );

    team.leader = newLeader._id;
    newLeader.teams.push(team._id);

    const notificationMessageForNewLeader = `You have been promoted as the leader of the team ${team.name} in ${project.name} by the previous team leader ${currentLeader.username}.`;

    const notificationForNewLeader = await notifications.create(
      [
        {
          to: newLeader._id,
          from: currentLeaderId,
          type: "teamLeaderPromotion",
          message: notificationMessageForNewLeader,
        },
      ],
      { session }
    );

    const newTeamActivity = await activities.create([
      {
        team: teamId,
        entity: "team",
        image: newLeader.profilePic,
        type: "teamLeaderChanged",
        message: `${newLeaderUsername} has been promoted as the new leader of this team by the previous team leader ${currentLeader.username}.`,
        read_users: [
          { readBy: newLeader.id, isRead: true },
          { readBy: currentLeader.id, isRead: true },
        ],
      },
    ]);

    team.activities.push(newTeamActivity[0]._id);
    newLeader.notifications.push(notificationForNewLeader[0]._id);

    await Promise.all([
      team.save({ session }),
      currentLeader.save({ session }),
      newLeader.save({ session }),
    ]);

    io.emit("teamActivities", newTeamActivity[0]._id);
    io.emit("notifications", notificationForNewLeader[0]._id);
    io.emit("teamDetails", (teamId + team.updatedAt).toString());

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

const setTeamGuide = async (teamId, newGuideUsername) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const team = await teams
      .findById(teamId)
      .select("icon name parent leader guide members activities")
      .populate({ path: "leader guide members", select: "username" })
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    const newGuide = await users
      .findOne({ username: newGuideUsername })
      .select("notifications teams profilePic")
      .session(session);

    if (!newGuide) throw new Error("UnknownUser");

    if (team.guide?.username === newGuideUsername)
      throw new Error("UserAlreadyInTeamAsGuide");

    if (team.members?.some((member) => member.equals(newGuide.id)))
      throw new Error("UserAlreadyInTeamAsMember");

    const project = await projects
      .findById(team.parent)
      .select("name unavailableMembers")
      .session(session);

    if (!project) throw new Error("UnknownProject");

    if (project.unavailableMembers.includes(newGuideUsername))
      throw new Error("UserAlreadyInAnotherTeam");

    let currentGuide;
    let notificationForCurrentGuide;

    if (team.guide) {
      currentGuide = await users
        .findById(team.guide)
        .select("notifications teams")
        .session(session);

      if (currentGuide) {
        currentGuide.teams = currentGuide.teams.filter(
          (team) => team.toString() !== teamId
        );

        notificationForCurrentGuide = await notifications.create(
          [
            {
              to: currentGuide._id,
              from: team.leader.id,
              type: "teamGuideDemotion",
              message: `You are no longer the guide of the team ${team.name} in project ${project.name}.`,
            },
          ],
          { session }
        );

        currentGuide.notifications.push(notificationForCurrentGuide[0]._id);
      }
    }

    team.guide = newGuide._id;
    newGuide.teams.push(team._id);

    const notificationForNewGuide = await notifications.create(
      [
        {
          to: newGuide._id,
          from: team.leader.id,
          type: "teamGuidePromotion",
          message: `You have been promoted as the guide of the team ${team.name} in project ${project.name} by the team leader ${team.leader.username}.`,
        },
      ],
      { session }
    );

    const newTeamActivity = await activities.create(
      [
        {
          team: teamId,
          entity: "team",
          image: newGuide.profilePic,
          type: "teamGuideChanged",
          message: `${newGuideUsername} has been promoted as the new guide of this team by the team leader ${team.leader.username}.`,
          read_users: [
            { readBy: newGuide.id, isRead: true },
            { readBy: team.leader.id, isRead: true },
            ...(currentGuide
              ? [{ readBy: currentGuide.id, isRead: true }]
              : []),
          ],
        },
      ],
      { session }
    );

    team.activities.push(newTeamActivity[0]._id);
    newGuide.notifications.push(notificationForNewGuide[0]._id);

    await Promise.all([
      team.save({ session }),
      project.save({ session }),
      newGuide.save({ session }),
      currentGuide?.save({ session }),
    ]);

    io.emit("teamActivities", newTeamActivity._id);
    io.emit("notifications", notificationForNewGuide._id);
    io.emit("teamDetails", (teamId + team.updatedAt).toString());

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

const setTeamActivities = async (userId, teamId) => {
  await activities.updateMany(
    {
      entity: "team",
      team: teamId,
      "read_users.readBy": { $ne: userId },
    },
    {
      $addToSet: {
        read_users: {
          readBy: userId,
          isRead: true,
        },
      },
    }
  );
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
  let activityMsg, notificationMsg;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const collaborator = await users
      .findOne({ username: collaboratorUsername })
      .select("teams notifications profilePic")
      .session(session);

    if (!collaborator) throw new Error("UnknownUser");

    const team = await teams
      .findById(teamId)
      .select("parent name leader guide members activities")
      .populate({
        path: "parent leader guide members",
        select: "name username project",
      })
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    const project = await projects
      .findById(team.parent)
      .select("name unavailableMembers")
      .session(session);

    if (role === "guide" && team.guide?.username === collaboratorUsername) {
      team.guide = null;
      notificationMsg = `You are no longer a guide of the team ${team.name} in project ${project.name}.`;
      activityMsg = `${collaboratorUsername}, who was a guide of this team, was removed by team leader ${team.leader.username}`;
    } else if (
      role === "member" &&
      team.members.some((member) => member.username === collaboratorUsername)
    ) {
      team.members = team.members.filter(
        (member) => member.username !== collaboratorUsername
      );
      notificationMsg = `You are no longer a member of the team ${team.name} in project ${team.parent.name}.`;
      activityMsg = `${collaboratorUsername}, who was a member of this team, was removed by team leader ${team.leader.username}`;
    } else {
      throw new Error("InvalidRole");
    }

    const newNotification = await notifications.create(
      [
        {
          from: team.leader,
          to: collaborator.id,
          type: "kickedFromTeam",
          message: notificationMsg,
        },
      ],
      { session }
    );

    collaborator.notifications.push(newNotification[0]._id);

    const newActivity = await activities.create(
      [
        {
          team: teamId,
          entity: "team",
          message: activityMsg,
          image: collaborator.profilePic,
          type: "teamCollaboratorRemoved",
          read_users: [
            { readBy: team.leader.id, isRead: true },
            { readBy: collaborator._id, isRead: true },
          ],
        },
      ],
      { session }
    );
    team.activities.push(newActivity[0]._id);

    collaborator.teams = collaborator.teams.filter(
      (team) => team.toString() !== teamId
    );

    project.unavailableMembers = project.unavailableMembers.filter(
      (member) => member !== collaboratorUsername
    );

    await Promise.all([
      team.save({ session }),
      project.save({ session }),
      collaborator.save({ session }),
    ]);
    await session.commitTransaction();
    session.endSession();

    io.emit("teamActivities", newActivity[0]._id);
    io.emit("teams", `${team.id}${team.updatedAt}`);
    io.emit("notifications", newNotification[0]._id);
    io.emit("teamDetails", (teamId + team.updatedAt).toString());
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
  setTeamGuide,
  createSubTeam,
  setTeamLeader,
  getTeamDetails,
  setTeamDetails,
  removeTeamIcon,
  getTeamMembers,
  getTeamSubTeams,
  createTeamMember,
  getTeamActivities,
  setTeamActivities,
  removeTeamCollaborator,
};
