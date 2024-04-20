const mongoose = require("mongoose");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const subteams = require("../models/subTeamModel");
const activities = require("../models/activityModel");
const notifications = require("../models/notificationModel");

// GET
const getSubTeam = async (subTeamId) => {
  const subTeam = await subteams
    .findById(subTeamId)
    .select("icon name description leader guide members NOM")
    .populate({ path: "leader guide members", select: "username profilePic" });

  if (!subTeam) throw new Error("UnknownSubTeam");

  return subTeam;
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

const getSubTeamSettings = async (subTeamId) => {
  const subTeam = await subteams
    .findById(subTeamId)
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

  if (!subTeam) throw new Error("UnknownSubTeam");

  const collaborators = [
    {
      role: "Leader",
      id: subTeam.leader?._id,
      username: subTeam.leader?.username,
      profilePic: subTeam.leader?.profilePic,
    },
    ...subTeam.members.map((member) => ({
      role: "Member",
      id: member._id,
      username: member.username,
      profilePic: member.profilePic,
    })),
  ];

  if (subTeam.guide) {
    collaborators.push({
      role: "Guide",
      id: subTeam.guide?._id,
      username: subTeam.guide?.username,
      profilePic: subTeam.guide?.profilePic,
    });
  }

  return {
    collaborators,
    icon: subTeam.icon,
    name: subTeam.name,
    NOC: collaborators.length,
    guide: subTeam.guide?.username,
    description: subTeam.description,
    leader: subTeam.leader?.username,
    parentMembers: subTeam.parent?.members,
  };
};

// POST
const setSubTeamCollaborator = async (userId, subTeamId, username, role) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const subTeam = await subteams
      .findById(subTeamId)
      .populate("members")
      .populate("grandParent")
      .session(session);

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

    if (
      team.subTeams?.some((subTeam) => subTeam.leader?.equals(collaborator._id))
    )
      throw new Error("UserAlreadyInAnotherSubTeamAsLeader");

    if (team.unavailableMembers?.includes(collaborator.username))
      throw new Error("UserAlreadyInAnotherSubTeam");

    if (
      subTeam.leader?.equals(collaborator._id) ||
      subTeam.guide?.equals(collaborator._id) ||
      subTeam.members?.some((member) => member.equals(collaborator._id))
    )
      throw new Error("UserAlreadyInSubTeam");

    if (role === "leader") {
      previousLeader.subTeams = previousLeader.subTeams.filter(
        (subTeam) => subTeam.toString() !== subTeamId
      );

      subTeam.leader = collaborator._id;

      const notificationMessageForLeader = `You are no longer the leader of the sub team ${subTeam.name} in team ${team.name} in project ${subTeam.grandParent?.name}.`;
      const newNotificationForLeader = await notifications.create(
        [
          {
            user: userId,
            type: "subTeamLeaderDemotion",
            message: notificationMessageForLeader,
            isRead: false,
          },
        ],
        { session }
      );

      subTeam.leader?.notifications?.push(newNotificationForLeader[0]._id);

      const notificationMessage = `You have been promoted as the leader of the team ${subTeam.name} in team ${team.name} in project ${subTeam.grandParent?.name} by the previous sub team leader ${previousLeader.username}.`;
      const newNotification = await notifications.create(
        [
          {
            user: collaborator._id,
            type: "subTeamLeaderPromotion",
            message: notificationMessage,
            isRead: false,
          },
        ],
        { session }
      );

      collaborator.subTeams?.push(subTeam._id);
      collaborator.notifications?.push(newNotification[0]._id);

      const activityMsg = `${username} have been promoted as the current leader of this sub team ${subTeam.name} by the previous leader ${previousLeader.username}.`;

      const newActivity = await activities.create(
        [
          {
            type: "subTeamLeaderChanged",
            message: activityMsg,
            image: subTeam.icon,
          },
        ],
        { session }
      );

      subTeam.activities.push(newActivity[0]._id);
    } else if (role === "member") {
      subTeam.members.push(collaborator._id);

      const notificationMessage = `You have been added as a member in sub team ${subTeam.name} in team ${team.name} in project ${subTeam.grandParent?.name} by leader ${subTeam.leader.username}.`;
      const newNotification = await notifications.create(
        [
          {
            user: collaborator._id,
            type: "addedAsSubTeamCollaborator",
            message: notificationMessage,
            isRead: false,
          },
        ],
        { session }
      );

      collaborator.subTeams?.push(subTeam._id);
      collaborator.notifications?.push(newNotification[0]._id);

      const activityMsg = `${username} have been added as a member in this sub team ${subTeam.name} by leader ${subTeam.leader.username}`;

      const newActivity = await activities.create(
        [
          {
            type: "subTeamCollaboratorAdded",
            message: activityMsg,
            image: subTeam.icon,
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
      previousLeader.save(),
      subTeam.save({ session }),
      team.save({ session }),
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

// PATCH
const setSubTeamDetails = async (subTeamId, newSubTeamDetails) => {
  const subTeam = await subteams.findById(subTeamId);
  if (!subTeam) throw new Error("UnknownSubTeam");
  const { name, description } = newSubTeamDetails;
  subTeam.name = name;
  subTeam.description = description;
  await subTeam.save();

  io.emit("subTeams", (subTeam.id + subTeam.updatedAt).toString());
};

const setSubTeamIcon = async (subTeamId, newSubTeamIcon) => {
  const subTeam = await subteams.findById(subTeamId);
  if (!subTeam) throw new Error("UnknownSubTeam");
  subTeam.icon = newSubTeamIcon;
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
  role,
  subTeamId,
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
  getSubTeam,
  setSubTeamIcon,
  setSubTeamDetails,
  removeSubTeamIcon,
  getSubTeamSettings,
  getSubTeamActivities,
  setSubTeamCollaborator,
  removeSubTeamCollaborator,
};
