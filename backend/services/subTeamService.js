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

const getSubTeamActivities = async (userId, teamId) => {
  const subTeam = await subteams
    .findById(subTeamId)
    .select("activities")
    .populate({
      path: "activities",
      select: "-type -__v -updatedAt",
    });

  if (!subTeam) throw new Error("UnknownSubTeam");

  const formattedSubTeamActivities = subTeam.activities.map((activity) => {
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

  return formattedSubTeamActivities.sort((a, b) =>
    a.isRead !== b.isRead
      ? a.isRead
        ? 1
        : -1
      : new Date(b.createdAt) - new Date(a.createdAt)
  );
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

const createSubTeamMember = async (subTeamId, newMemberUsername) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const subTeam = await subteams
      .findById(subTeamId)
      .select("name parent grandParent leader guide members activities")
      .populate({
        path: "grandParent leader guide members",
        select: "name username",
      })
      .session(session);

    if (!subTeam) throw new Error("UnknownSubTeam");

    const newMember = await users
      .findOne({ username: newMemberUsername })
      .select("username notifications subTeams profilePic")
      .session(session);

    if (!newMember) throw new Error("UnknownUser");

    if (subTeam.guide?.username === newMemberUsername)
      throw new Error("UserAlreadyInSubTeamAsGuide");

    if (subTeam.members?.some((member) => member.equals(newMember.id)))
      throw new Error("UserAlreadyInSubTeamAsMember");

    const team = await teams
      .findById(subTeam.parent)
      .select("name unavailableMembers")
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    if (team.unavailableMembers.includes(newMemberUsername))
      throw new Error("UserAlreadyInAnotherSubTeam");

    subTeam.members.push(newMember.id);
    newMember.subTeams.push(subTeam.id);

    const notificationMessageForNewMember = `You have been added as a member in the subTeam ${subTeam.name} in the team ${team.name} in project ${subTeam.grandParent.name} by the subTeam leader ${subTeam.leader.username}.`;

    const notificationForNewMember = await notifications.create(
      [
        {
          to: newMember.id,
          from: subTeam.leader.id,
          type: "addedAsSubTeamMember",
          message: notificationMessageForNewMember,
        },
      ],
      { session }
    );

    newMember.notifications.push(notificationForNewMember[0]._id);

    const newSubTeamActivity = await activities.create([
      {
        entity: "subTeam",
        subTeam: subTeamId,
        type: "subTeamMemberAdded",
        image: newMember.profilePic,
        message: `${newMember.username} has been added as a member by the subTeam leader ${subTeam.leader.username}.`,
        read_users: [
          { readBy: newMember.id, isRead: true },
          { readBy: subTeam.leader.id, isRead: true },
        ],
      },
    ]);

    subTeam.activities.push(newSubTeamActivity[0]._id);

    team.unavailableMembers.push(newMemberUsername);

    await Promise.all([
      team.save({ session }),
      subTeam.save({ session }),
      newMember.save({ session }),
    ]);

    io.emit("subTeamActivities", newSubTeamActivity[0]._id);
    io.emit("notifications", notificationForNewMember[0]._id);
    io.emit("subTeamDetails", (subTeamId + subTeam.updatedAt).toString());

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
const setSubTeamDetails = async (subTeamId, updatedSubTeamDetails) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const subTeam = await subteams
      .findById(subTeamId)
      .select("name description icon leader parent")
      .populate({
        path: "leader",
        select: "username",
      })
      .session(session);

    if (!subTeam) throw new Error("UnknownSubTeam");

    const { name, description } = updatedSubTeamDetails;

    const previousSubTeamName = subTeam.name;

    const team = await teams
      .findById(subTeam.parent)
      .select("activities")
      .session(session);
    if (!team) throw new Error("UnknownTeam");

    subTeam.name = name;
    subTeam.description = description;

    const newActivity = await activities.create(
      [
        {
          entity: "team",
          project: team.id,
          image: subTeam.icon,
          type: "subTeamUpdatedInTeam",
          message: `The subTeam ${previousSubTeamName} is updated to ${subTeam.name} by its leader ${subTeam.leader.username}.`,
          read_users: [{ readBy: subTeam.leader.id, isRead: true }],
        },
      ],
      { session }
    );

    team.activities.push(newActivity[0].id);

    await Promise.all([subTeam.save({ session }), team.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    io.emit("teamActivities", newActivity[0].id);
    io.emit("subTeams", (subTeam.id + subTeam.updatedAt).toString());
    io.emit("subTeamDetails", (subTeam.id + subTeam.updatedAt).toString());
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const setSubTeamLeader = async (
  subTeamId,
  currentLeaderId,
  newLeaderUsername
) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const subTeam = await subteams
      .findById(subTeamId)
      .select("name icon parent grandParent activities leader members guide")
      .populate({
        path: "grandParent",
        select: "name",
      })
      .session(session);

    if (!subTeam) throw new Error("UnknownSubTeam");

    const newLeader = await users
      .findOne({ username: newLeaderUsername })
      .select("notifications subTeams profilePic")
      .session(session);

    if (!newLeader) throw new Error("UnknownUser");

    if (subTeam.guide?.username === newLeaderUsername)
      throw new Error("UserAlreadyInSubTeamAsGuide");

    if (subTeam.members?.some((member) => member.equals(newLeader.id)))
      throw new Error("UserAlreadyInSubTeamAsMember");

    let team = await teams
      .findById(subTeam.parent)
      .select("name unavailableMembers")
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    if (team.unavailableMembers.includes(newLeaderUsername))
      throw new Error("UserAlreadyInAnotherSubTeam");

    const currentLeader = await users
      .findById(currentLeaderId)
      .select("username notifications subTeams")
      .session(session);

    if (!currentLeader) throw new Error("UnknownUser");

    currentLeader.subTeams = currentLeader.subTeams.filter(
      (subTeam) => subTeam.toString() !== subTeamId
    );

    subTeam.leader = newLeader._id;
    newLeader.subTeams.push(subTeam._id);

    const notificationMessageForNewLeader = `You have been promoted as the leader of the subTeam ${subTeam.name} in team ${team.name} in project ${subTeam.grandParent.name} by the previous subTeam leader ${currentLeader.username}.`;

    const notificationForNewLeader = await notifications.create(
      [
        {
          to: newLeader._id,
          from: currentLeaderId,
          type: "subTeamLeaderPromotion",
          message: notificationMessageForNewLeader,
        },
      ],
      { session }
    );

    const newSubTeamActivity = await activities.create([
      {
        subTeam: subTeamId,
        entity: "subTeam",
        image: newLeader.profilePic,
        type: "subTeamLeaderChanged",
        message: `${newLeaderUsername} has been promoted as the new leader of this subTeam by the previous subTeam leader ${currentLeader.username}.`,
        read_users: [
          { readBy: newLeader.id, isRead: true },
          { readBy: currentLeader.id, isRead: true },
        ],
      },
    ]);

    subTeam.activities.push(newSubTeamActivity[0]._id);
    newLeader.notifications.push(notificationForNewLeader[0]._id);

    await Promise.all([
      subTeam.save({ session }),
      currentLeader.save({ session }),
      newLeader.save({ session }),
    ]);

    io.emit("subTeamActivities", newSubTeamActivity[0]._id);
    io.emit("notifications", notificationForNewLeader[0]._id);
    io.emit("subTeamDetails", (subTeamId + subTeam.updatedAt).toString());

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

const setSubTeamGuide = async (subTeamId, newGuideUsername) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const subTeam = await subteams
      .findById(subTeamId)
      .select("icon name parent grandParent leader guide members activities")
      .populate({
        path: "grandParent leader guide members",
        select: "name username",
      })
      .session(session);

    if (!subTeam) throw new Error("UnknownSubTeam");

    const newGuide = await users
      .findOne({ username: newGuideUsername })
      .select("notifications subTeams profilePic")
      .session(session);

    if (!newGuide) throw new Error("UnknownUser");

    if (subTeam.guide?.username === newGuideUsername)
      throw new Error("UserAlreadyInSubTeamAsGuide");

    if (subTeam.members?.some((member) => member.equals(newGuide.id)))
      throw new Error("UserAlreadyInSubTeamAsMember");

    const team = await teams
      .findById(subTeam.parent)
      .select("name unavailableMembers")
      .session(session);

    if (!team) throw new Error("UnknownTeam");

    if (team.unavailableMembers.includes(newGuideUsername))
      throw new Error("UserAlreadyInAnotherSubTeam");

    let currentGuide;
    let notificationForCurrentGuide;

    if (subTeam.guide) {
      currentGuide = await users
        .findById(subTeam.guide)
        .select("notifications subTeams")
        .session(session);

      if (currentGuide) {
        currentGuide.subTeams = currentGuide.subTeams.filter(
          (subTeam) => subTeam.toString() !== subTeamId
        );

        notificationForCurrentGuide = await notifications.create(
          [
            {
              to: currentGuide._id,
              from: subTeam.leader.id,
              type: "subTeamGuideDemotion",
              message: `You are no longer the guide of the subTeam ${subTeam.name} in team ${team.name} in project ${subTeam.grandParent.name}.`,
            },
          ],
          { session }
        );

        currentGuide.notifications.push(notificationForCurrentGuide[0]._id);
      }
    }

    subTeam.guide = newGuide._id;
    newGuide.subTeams.push(subTeam._id);

    const notificationForNewGuide = await notifications.create(
      [
        {
          to: newGuide._id,
          from: subTeam.leader.id,
          type: "subTeamGuidePromotion",
          message: `You have been promoted as the guide of the subTeam ${subTeam.name} in team ${team.name} in project ${subTeam.grandParent.name} by subTeam leader ${subTeam.leader.username}.`,
        },
      ],
      { session }
    );

    const newSubTeamActivity = await activities.create(
      [
        {
          entity: "subTeam",
          subTeam: subTeamId,
          image: newGuide.profilePic,
          type: "subTeamGuideChanged",
          message: `${newGuideUsername} has been promoted as the new guide of this subTeam by the subTeam leader ${subTeam.leader.username}.`,
          read_users: [
            { readBy: newGuide.id, isRead: true },
            { readBy: subTeam.leader.id, isRead: true },
            ...(currentGuide
              ? [{ readBy: currentGuide.id, isRead: true }]
              : []),
          ],
        },
      ],
      { session }
    );

    subTeam.activities.push(newSubTeamActivity[0]._id);
    newGuide.notifications.push(notificationForNewGuide[0]._id);

    await Promise.all([
      team.save({ session }),
      subTeam.save({ session }),
      newGuide.save({ session }),
      currentGuide?.save({ session }),
    ]);

    io.emit("subTeamActivities", newSubTeamActivity._id);
    io.emit("notifications", notificationForNewGuide._id);
    io.emit("subTeamDetails", (subTeamId + subTeam.updatedAt).toString());

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

const setSubTeamActivities = async (userId, subTeamId) => {
  await activities.updateMany(
    {
      entity: "subTeam",
      team: subTeamId,
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

const removeSubTeamCollaborator = async (
  subTeamId,
  collaboratorUsername,
  role
) => {
  let session = null;
  let activityMsg, notificationMsg;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const collaborator = await users
      .findOne({ username: collaboratorUsername })
      .select("subTeams notifications profilePic")
      .session(session);

    if (!collaborator) throw new Error("UnknownUser");

    const subTeam = await subteams
      .findById(subTeamId)
      .select("parent grandParent name leader guide members activities")
      .populate({
        path: "parent grandParent leader guide members",
        select: "name username project",
      })
      .session(session);

    if (!subTeam) throw new Error("UnknownSubTeam");

    const team = await teams
      .findById(subTeam.parent)
      .select("name unavailableMembers")
      .session(session);

    if (role === "guide" && subTeam.guide?.username === collaboratorUsername) {
      subTeam.guide = null;
      notificationMsg = `You are no longer a guide of the subTeam ${subTeam.name} in team ${team.name} in project ${subTeam.grandParent.name}.`;
      activityMsg = `${collaboratorUsername}, who was a guide of this subTeam, was removed by subTeam leader ${subTeam.leader.username}`;
    } else if (
      role === "member" &&
      subTeam.members.some((member) => member.username === collaboratorUsername)
    ) {
      subTeam.members = subTeam.members.filter(
        (member) => member.username !== collaboratorUsername
      );
      notificationMsg = `You are no longer a member of the subTeam ${subTeam.name} in team ${team.name} in project ${subTeam.grandParent.name}.`;
      activityMsg = `${collaboratorUsername}, who was a member of this subTeam, was removed by subTeam leader ${subTeam.leader.username}`;
    } else {
      throw new Error("InvalidRole");
    }

    const newNotification = await notifications.create(
      [
        {
          from: subTeam.leader,
          to: collaborator.id,
          type: "kickedFromSubTeam",
          message: notificationMsg,
        },
      ],
      { session }
    );

    collaborator.notifications.push(newNotification[0]._id);

    const newActivity = await activities.create(
      [
        {
          subTeam: subTeamId,
          entity: "subTeam",
          message: activityMsg,
          image: collaborator.profilePic,
          type: "subTeamCollaboratorRemoved",
          read_users: [
            { readBy: subTeam.leader.id, isRead: true },
            { readBy: collaborator._id, isRead: true },
          ],
        },
      ],
      { session }
    );
    subTeam.activities.push(newActivity[0]._id);

    collaborator.subTeams = collaborator.subTeams.filter(
      (subTeam) => subTeam.toString() !== subTeamId
    );

    team.unavailableMembers = team.unavailableMembers.filter(
      (member) => member !== collaboratorUsername
    );

    await Promise.all([
      team.save({ session }),
      subTeam.save({ session }),
      collaborator.save({ session }),
    ]);
    await session.commitTransaction();
    session.endSession();

    io.emit("subTeamActivities", newActivity[0]._id);
    io.emit("notifications", newNotification[0]._id);
    io.emit("subTeams", `${subTeam.id}${subTeam.updatedAt}`);
    io.emit("subTeamDetails", (subTeamId + subTeam.updatedAt).toString());
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

module.exports = {
  setSubTeamIcon,
  setSubTeamGuide,
  setSubTeamLeader,
  setSubTeamDetails,
  getSubTeamDetails,
  getSubTeamMembers,
  removeSubTeamIcon,
  createSubTeamMember,
  getSubTeamActivities,
  setSubTeamActivities,
  removeSubTeamCollaborator,
};
