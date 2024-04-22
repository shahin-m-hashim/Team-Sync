const moment = require("moment");
const { io } = require("../server");
const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
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
const createTeamMember = async (teamId, newMemberUsername) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const team = await teams
      .findById(teamId)
      .select("name icon parent leader members")
      .populate({ path: "leader", select: "username" })
      .populate({
        path: "parent members",
        select: "name username unAvailableMembers",
      })
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    const newMember = await users
      .findOne({ username: newGuideUsername })
      .select("notifications teams")
      .session(session);

    if (!newMember) throw new Error("UnknownUser");

    if (team.members?.some((member) => member.equals(newMember.id)))
      throw new Error("UserAlreadyInTeamAsMember");

    if (team.parent.unAvailableMembers.includes(newMemberUsername))
      throw new Error("UserAlreadyInAnotherTeam");

    team.members.push(newMember.id);
    newMember.teams.push(team._id);

    const notificationMessageForNewMember = `You have been add as a member in the team ${team.name} in project ${team.parent.name} by the team leader ${team.leader.username}.`;

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

    const newTeamActivity = await activities.create([
      {
        team: teamId,
        entity: "team",
        image: team.icon,
        type: "teamMemberAdded",
        message: `${newMember.username} has been added as a member by the team leader ${team.leader.username}.`,
        read_users: [
          { readBy: team.leader.id, isRead: true },
          { readBy: newMember.id, isRead: true },
        ],
      },
    ]);

    team.parent.unAvailableMembers.push(newMemberUsername);

    await Promise.all([team.save({ session }), newMember.save({ session })]);

    io.emit("notifications", notificationForNewMember[0]._id);
    io.emit("teamActivities", newTeamActivity[0]._id);

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
  const team = await teams
    .findById(teamId)
    .select("name description icon leader")
    .populate("leader");

  if (!team) throw new Error("UnknownTeam");
  const { name, description } = updatedTeamDetails;

  const previousTeamName = team.name;

  team.name = name;
  team.description = description;
  await team.save();

  const newActivity = await activities.create({
    team: teamId,
    entity: "team",
    image: team.icon,
    type: "teamUpdatedInProject",
    message: `The team ${previousTeamName} is updated to ${team.name} by its leader ${team.leader.username}.`,
    read_users: [{ readBy: userId, isRead: true }],
  });

  io.emit("projectActivities", newActivity.id);
  io.emit("teams", (team.id + team.updatedAt).toString());
};

const setTeamLeader = async (teamId, currentLeaderId, newLeaderUsername) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const team = await teams
      .findById(teamId)
      .select("name icon parent")
      .populate({
        path: "parent",
        select: "name unAvailableMembers",
      })
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    const currentLeader = await users
      .findById(currentLeaderId)
      .select("username notifications teams")
      .session(session);

    if (!currentLeader) throw new Error("UnknownUser");

    const newLeader = await users
      .findOne({ username: newLeaderUsername })
      .select("notifications teams")
      .session(session);

    if (!newLeader) throw new Error("UnknownUser");

    if (team.parent.unAvailableMembers.includes(newLeaderUsername))
      throw new Error("UserAlreadyInAnotherTeam");

    currentLeader.teams = currentLeader.teams.filter(
      (team) => team.toString() !== teamId
    );

    team.leader = newLeader._id;
    newLeader.teams.push(team._id);

    const notificationMessageForNewLeader = `You have been promoted as the leader of the team ${team.name} in ${team.parent.name} by the previous team leader ${currentLeader.username}.`;

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

    const teamActivity = await activities.create([
      {
        team: teamId,
        entity: "team",
        image: team.icon,
        type: "teamLeaderChanged",
        message: `${newLeaderUsername} has been promoted as the new leader of this team by the previous team leader ${currentLeader.username}.`,
        read_users: [
          { readBy: currentLeader.id, isRead: true },
          { readBy: newLeader.id, isRead: true },
        ],
      },
    ]);

    await Promise.all([
      team.save({ session }),
      currentLeader.save({ session }),
      newLeader.save({ session }),
    ]);

    io.emit("notifications", notificationForNewLeader[0]._id);

    io.emit("teamActivities", teamActivity[0]._id);

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
      .select("icon name parent guide leader")
      .populate({ path: "leader", select: "username" })
      .populate({
        path: "parent",
        select: "name unAvailableMembers",
      })
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    const currentGuide = await users
      .findById(team.guide)
      .select("notifications teams")
      .session(session);

    if (!currentGuide) throw new Error("UnknownUser");

    const newGuide = await users
      .findOne({ username: newGuideUsername })
      .select("notifications teams")
      .session(session);

    if (!newGuide) throw new Error("UnknownUser");

    if (team.parent.unAvailableMembers.includes(newGuideUsername))
      throw new Error("UserAlreadyInAnotherTeam");

    currentGuide.teams = currentGuide.teams.filter(
      (team) => team.toString() !== teamId
    );

    team.guide = newGuide._id;
    newGuide.teams.push(team._id);

    const notificationMessageForNewGuide = `You have been promoted as the guide of the team ${team.name} in project ${team.parent.name} by the team leader ${team.leader.username}.`;

    const notificationForNewGuide = await notifications.create(
      [
        {
          to: newLeader._id,
          from: team.leader.id,
          type: "teamGuidePromotion",
          message: notificationMessageForNewGuide,
        },
      ],
      { session }
    );

    const notificationMessageForCurrentGuide = `You are no longer the guide of the team ${team.name} in project ${team.parent.name}.`;
    const notificationForCurrentGuide = await notifications.create(
      [
        {
          to: currentGuide._id,
          from: team.leader.id,
          type: "teamGuideDemotion",
          message: notificationMessageForCurrentGuide,
        },
      ],
      { session }
    );

    const newTeamActivity = await activities.create([
      {
        team: teamId,
        entity: "team",
        image: team.icon,
        type: "teamGuideChanged",
        message: `The guide of this team has been changed from ${currentGuide.username} to ${newGuide.username} by the team leader ${team.leader.username}.`,
        read_users: [
          { readBy: team.leader.id, isRead: true },
          { readBy: currentGuide.id, isRead: true },
          { readBy: newGuide.id, isRead: true },
        ],
      },
    ]);

    await Promise.all([
      team.save({ session }),
      currentGuide.save({ session }),
      newGuide.save({ session }),
    ]);

    io.emit(
      "notifications",
      notificationForNewGuide[0]._id + notificationForCurrentGuide[0]._id
    );

    io.emit("teamActivities", newTeamActivity[0]._id);

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
      .select("parent name leader guide members invitations activities")
      .populate({
        path: "leader guide members invitations",
        select: "username project",
      })
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    if (role === "guide" && team.guide?.username === collaboratorUsername) {
      team.guide = null;
      notificationMsg = `You are no longer a guide of the team ${team.name} in project ${team.parent.name}.`;
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

    collaborator.teams = collaborator.teams.filter(
      (team) => team.toString() !== teamId
    );

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

    await Promise.all([team.save({ session }), collaborator.save({ session })]);
    await session.commitTransaction();
    session.endSession();

    io.emit("teamActivities", newActivity[0]._id);
    io.emit("teams", `${team.id}${team.updatedAt}`);
    io.emit("notifications", newNotification[0]._id);
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
