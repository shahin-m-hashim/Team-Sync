const { io } = require("../server");
const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const subteams = require("../models/subTeamModel");
const activities = require("../models/activityModel");
const notifications = require("../models/notificationModel");

// GET
const getSubTeamDetails = async (subTeamId) => {
  let collaborators = [];

  const subTeam = await subteams
    .findById(subTeamId)
    .select("icon name description leader guide members NOM")
    .populate({
      path: "leader guide members",
      select: "username profilePic id",
    });

  if (!subTeam) throw new Error("UnknownProject");

  collaborators.push({
    id: subTeam.leader?.id,
    role: "Leader",
    username: subTeam.leader?.username,
    profilePic: subTeam.leader?.profilePic,
  });

  subTeam.guide &&
    collaborators.push({
      id: subTeam.guide?.id,
      role: "Guide",
      username: subTeam.guide?.username,
      profilePic: subTeam.guide?.profilePic,
    });

  subTeam.members &&
    subTeam.members.forEach((member) => {
      collaborators.push({
        id: member.id,
        role: "Member",
        username: member?.username,
        profilePic: member?.profilePic,
      });
    });

  return {
    collaborators,
    icon: subTeam.icon,
    name: subTeam.name,
    description: subTeam.description,
    NOC: subTeam.NOM + (subTeam.guide ? 1 : 0) + 1,
  };
};

const getSubTeamMembers = async (subTeamId) => {
  const subTeamMembers = await subteams
    .findById(subTeamId)
    .select("members -_id")
    .populate({
      path: "members",
      select: "username profilePic tag fname",
    });
  if (!subTeamMembers) throw new Error("UnknownSubTeam");

  return subTeamMembers;
};

const getSubTeamActivities = async (subTeamId) => {
  const subTeam = await subteams
    .findById(subTeamId)
    .select("activities")
    .populate({
      path: "activities",
      select: "-type -__v -updatedAt",
    });

  if (!subTeam) throw new Error("UnknownSubTeam");

  const formattedSubTeamActivities = subTeam.activities.map((activity) => {
    return {
      ...activity.toObject(),
      time: moment(activity.createdAt).format("hh:mm A"),
      date: moment(activity.createdAt).format("DD/MM/YYYY"),
    };
  });

  return formattedSubTeamActivities;
};

// const getSubTeamTasks = async (subTeamId, userId) => {
//   const subTeam = await subteams.findById(subTeamId).select("tasks").populate({
//     path: "tasks",
//     select: "parent name createdAt icon progress status leader guide members",
//   });
//   if (!team) throw new Error("UnknownTeam");

//   const formattedSubTeams = team.subTeams.map((subTeam) => {
//     let role = "Member";

//     const createdAt = moment(subTeam.createdAt).format("DD/MM/YYYY");

//     if (subTeam.guide?.toString() === userId) role = "Guide";
//     if (subTeam.leader?.toString() === userId) role = "Leader";

//     return {
//       role,
//       createdAt,
//       id: subTeam._id,
//       name: subTeam.name,
//       icon: subTeam.icon,
//       parent: subTeam.parent,
//       status: subTeam.status,
//       progress: subTeam.progress,
//       grandParent: subTeam.grandParent,
//     };
//   });

//   return formattedSubTeams;
// };

// POST

const setSubTeamCollaborator = async (userId, subTeamId, username, role) => {
  let session = null;
  let newActivity = null;
  let newNotification = null;
  let newNotificationForLeader = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const subTeam = await subteams
      .findById(subTeamId)
      .session(session)
      .populate("members");

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

    if (team.subTeams?.some((team) => team.leader?.equals(collaborator._id)))
      throw new Error("UserAlreadyInAnotherTeamAsLeader");

    if (team.unavailableMembers?.includes(collaborator.username))
      throw new Error("UserAlreadyInAnotherSubTeam");

    if (subTeam.guide?.equals(collaborator._id)) {
      throw new Error("UserAlreadyInSubTeamAsGuide");
    }

    if (team.members?.some((member) => member.equals(collaborator._id))) {
      throw new Error("UserAlreadyInSubTeamAsMember");
    }

    if (role === "leader") {
      previousLeader.subTeams = previousLeader.subTeams.filter(
        (subTeam) => subTeam.toString() !== subTeamId
      );

      subTeam.leader = collaborator._id;

      const notificationMessageForLeader = `You are no longer the leader of the sub team ${subTeam.name} in team ${subTeam.parent.name} within project ${subTeam.grandParent.name}.`;
      newNotificationForLeader = await notifications.create(
        [
          {
            to: previousLeader._id,
            type: "subTeamLeaderDemotion",
            message: notificationMessageForLeader,
          },
        ],
        { session }
      );

      team.leader?.notifications?.push(newNotificationForLeader[0]._id);

      const notificationMessage = `You have been promoted as the leader of the sub team ${subTeam.name} in team ${subTeam.parent.name} within project ${subTeam.grandParent.name} by the previous sub team leader ${previousLeader.username}.`;
      newNotification = await notifications.create(
        [
          {
            to: collaborator._id,
            from: userId,
            type: "subTeamLeaderPromotion",
            message: notificationMessage,
            isRead: false,
          },
        ],
        { session }
      );

      collaborator.teams?.push(team._id);
      collaborator.notifications?.push(newNotification[0]._id);

      const activityMsg = `${username} have been promoted as the current leader of this sub team by the previous leader ${previousLeader.username}.`;

      newActivity = await activities.create(
        [
          {
            entity: "team",
            subTeam: subTeamId,
            image: subTeam.icon,
            message: activityMsg,
            type: "subTeamLeaderChanged",
            read_users: [
              { readBy: previousLeader._id, isRead: true },
              { readBy: collaborator._id, isRead: true },
            ],
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
            entity: "subTeam",
            subTeam: subTeamId,
            image: subTeam.icon,
            message: activityMsg,
            type: "teamCollaboratorAdded",
            read_users: [{ readBy: userId, isRead: true }],
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
      previousLeader.save({ session }),
      team.save({ session }),
    ]);

    io.emit(
      "notifications",
      newNotification[0]._id + newNotificationForLeader[0]._id
    );

    io.emit("subTeamActivities", newActivity[0]._id);

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

// PATCH
const setSubTeamDetails = async (subTeamId, updatedSubTeamDetails) => {
  const subTeam = await subteams
    .findById(subTeamId)
    .select("name description icon leader")
    .populate("leader");

  if (!subTeam) throw new Error("UnknownSubTeam");
  const { name, description } = updatedSubTeamDetails;

  const previousSubTeamName = subTeam.name;

  subTeam.name = name;
  subTeam.description = description;
  await subTeam.save();

  const newActivity = await activities.create({
    entity: "subTeam",
    subTeam: subTeamId,
    image: subTeam.icon,
    type: "subTeamUpdatedInTeam",
    message: `The sub team ${previousSubTeamName} is updated to ${subTeam.name} by its leader ${subTeam.leader.username}.`,
    read_users: [{ readBy: userId, isRead: true }],
  });

  io.emit("teamActivities", newActivity.id);
  io.emit("subTeams", (subTeam.id + subTeam.updatedAt).toString());
};

const setSubTeamActivities = async (userId, subTeamId) => {
  await activities.updateMany(
    {
      entity: "subTeam",
      subTeam: subTeamId,
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

const setSubTeamIcon = async (subTeamId, updatedSubTeamIcon) => {
  const subTeam = await subteams.findById(subTeamId);
  if (!subTeam) throw new Error("UnknownSubTeam");
  subTeam.icon = updatedSubTeamIcon;
  await subTeam.save();

  io.emit("subTeams", (subTeam.id + subTeam.updatedAt).toString());

  return subTeam.icon;
};

// DELETE
const removeSubTeamIcon = async (subTeamId) => {
  const subTeam = await subteams.findById(subTeamId);
  if (!subTeam) throw new Error("UnknownSubTeam");
  subTeam.icon = "";
  await subTeam.save();

  io.emit("subTeams", (subTeam.id + subTeam.updatedAt).toString());
};

module.exports = {
  setSubTeamIcon,
  getSubTeamDetails,
  setSubTeamDetails,
  removeSubTeamIcon,
  getSubTeamMembers,
  setSubTeamActivities,
  getSubTeamActivities,
  setSubTeamCollaborator,
};
