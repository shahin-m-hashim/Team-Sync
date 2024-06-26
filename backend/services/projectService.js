const moment = require("moment");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const tasks = require("../models/taskModel");
const projects = require("../models/projectModel");
const { io, connectedUsers } = require("../server");
const activities = require("../models/activityModel");
const invitations = require("../models/invitationModel");
const notifications = require("../models/notificationModel");

// GET
const getProjectDetails = async (projectId) => {
  let collaborators = [];

  const project = await projects
    .findById(projectId)
    .select("icon name description leader guide members NOM")
    .populate({
      path: "leader guide members",
      select: "username profilePic id",
    });

  if (!project) throw new Error("UnknownProject");

  collaborators.push({
    id: project.leader?.id,
    role: "Leader",
    username: project.leader?.username,
    profilePic: project.leader?.profilePic,
  });

  project.guide &&
    collaborators.push({
      id: project.guide?.id,
      role: "Guide",
      username: project.guide?.username,
      profilePic: project.guide?.profilePic,
    });

  project.members &&
    project.members.forEach((member) => {
      collaborators.push({
        id: member.id,
        role: "Member",
        username: member?.username,
        profilePic: member?.profilePic,
      });
    });

  return {
    collaborators,
    icon: project.icon,
    name: project.name,
    description: project.description,
    NOC: project.members.length + (project.guide ? 1 : 0) + 1,
  };
};

const getProjectMembers = async (projectId) => {
  const projectMembers = await projects
    .findById(projectId)
    .select("members -_id")
    .populate({
      path: "members",
      select: "username profilePic tag fname",
    });

  if (!projectMembers) throw new Error("UnknownProject");

  return projectMembers;
};

const getProjectActivities = async (userId, projectId) => {
  const project = await projects
    .findById(projectId)
    .select("activities")
    .populate({
      path: "activities",
      select: "-type -__v -updatedAt",
    });

  if (!project) throw new Error("UnknownProject");

  const formattedProjectActivities = project.activities.map((activity) => {
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

  return formattedProjectActivities.sort((a, b) =>
    a.isRead !== b.isRead
      ? a.isRead
        ? 1
        : -1
      : new Date(b.createdAt) - new Date(a.createdAt)
  );
};

const getProjectTeams = async (userId, projectId) => {
  const project = await projects.findById(projectId).select("teams").populate({
    path: "teams",
    select: "parent name createdAt icon progress status leader guide members",
  });
  if (!project) throw new Error("UnknownProject");

  const formattedTeams = project.teams.map((team) => {
    let role = "Collaborator";

    const createdAt = moment(team.createdAt).format("DD/MM/YYYY");

    if (team.guide?.toString() === userId) role = "Guide";
    if (team.leader?.toString() === userId) role = "Leader";
    if (team.members?.some((member) => member.toString() === userId))
      role = "Member";

    return {
      role,
      createdAt,
      id: team._id,
      name: team.name,
      icon: team.icon,
      parent: team.parent,
      status: team.status,
      progress: team.progress,
    };
  });

  return formattedTeams;
};

// POST
const sendProjectInvitation = async (userId, projectId, username, role) => {
  let session = null;
  let newInvitation = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const project = await projects
      .findById(projectId)
      .select("name leader guide members invitations")
      .populate({
        path: "leader guide members invitations",
        select: "username to project status",
      })
      .session(session);

    if (!project) throw new Error("UnknownProject");

    const invitedUser = await users
      .findOne({ username })
      .select("username invitations")
      .session(session);
    if (!invitedUser) throw new Error("UnknownUser");

    if (project.guide?.username === username)
      throw new Error("UserAlreadyInProjectAsGuide");

    if (project.members?.some((member) => member?.username === username))
      throw new Error("UserAlreadyInProjectAsMember");

    const existingInvitation = project.invitations.find(
      (invitation) =>
        invitation.to.toString() === invitedUser.id.toString() &&
        invitation.project.toString() === projectId &&
        ["pending", "accepted"].includes(invitation.status)
    );

    if (existingInvitation) throw new Error("UserAlreadyInvited");

    const inviteAcceptToken = jwt.sign(
      { invitedUserId: invitedUser._id },
      process.env.JWT_INVITATION_KEY,
      {
        expiresIn: "24h",
      }
    );

    const invitationMessage = `You have been invited to join the project ${project?.name} as a ${role} by its leader ${project.leader.username}.`;
    newInvitation = await invitations.create(
      [
        {
          role,
          from: userId,
          status: "pending",
          project: projectId,
          to: invitedUser._id,
          message: invitationMessage,
          authenticity: inviteAcceptToken,
        },
      ],
      { session }
    );

    project.invitations.push(newInvitation[0]._id);
    await project.save({ session });

    invitedUser.invitations.push(newInvitation[0]._id);
    await invitedUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    io.emit("invitations", newInvitation[0]._id);
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const createTeam = async (userId, projectId, teamDetails) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const user = await users.findById(userId).select("teams").session(session);
    if (!user) throw new Error("UnknownUser");

    const project = await projects
      .findById(projectId)
      .select("leader guide teams activities")
      .populate({
        path: "leader",
        select: "username",
      })
      .session(session);
    if (!project) throw new Error("UnknownProject");

    const newTeam = await teams.create(
      [
        {
          ...teamDetails,
          leader: userId,
          parent: projectId,
          guide: project.guide,
        },
      ],
      { session }
    );

    user.teams.push(newTeam[0]._id);
    project.teams.push(newTeam[0]._id);

    const newActivity = await activities.create(
      [
        {
          entity: "project",
          project: projectId,
          image: newTeam[0].icon,
          type: "teamAddedToProject",
          message: `A new team ${newTeam[0].name} is added to this project by leader ${project.leader.username}.`,
          read_users: [{ readBy: userId, isRead: true }],
        },
      ],
      { session }
    );

    project.activities.push(newActivity[0]._id);

    await Promise.all([user.save({ session }), project.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    io.emit("teams", newTeam[0]._id);
    io.emit("projectActivities", newActivity[0]._id);
    return newTeam[0]._id;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

// PATCH
const setProjectDetails = async (projectId, updatedProjectDetails) => {
  const newNotifications = [];

  const project = await projects
    .findById(projectId)
    .select("name description guide members leader")
    .populate({
      path: "guide members leader",
    });

  if (!project) throw new Error("UnknownProject");

  const { name, description } = updatedProjectDetails;
  const previousProjectName = project.name;

  project.name = name;
  project.description = description;

  const collaborators = [];
  if (project.guide) collaborators.push(project.guide);
  if (project.members) collaborators.push(...project.members);

  for (const collaborator of collaborators) {
    if (collaborator.username !== project.leader.username) {
      const newNotification = await notifications.create({
        from: project.leader,
        to: collaborator.id,
        type: "projectNameUpdated",
        message: `The project ${previousProjectName} is updated to ${project.name} by its leader ${project.leader.username}.`,
      });
      newNotifications.push(newNotification);
      collaborator.notifications.push(newNotification._id);
      await collaborator.save();
    }
  }

  await project.save();

  io.emit("notifications", newNotifications[0]._id);
  io.emit("projects", (project.id + project.updatedAt).toString());
  io.emit("projectDetails", (project.id + project.updatedAt).toString());
};

const setProjectActivities = async (userId, projectId) => {
  const project = await projects.findById(projectId).select("leader");
  if (!project) throw new Error("UnknownProject");

  if (userId === project.leader.toString()) return;

  await activities.updateMany(
    {
      entity: "project",
      project: projectId,
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

const setProjectIcon = async (projectId, updatedProjectIcon) => {
  const project = await projects.findById(projectId);
  if (!project) throw new Error("UnknownProject");
  project.icon = updatedProjectIcon;
  await project.save();

  io.emit("projects", (project.id + project.updatedAt).toString());
  io.emit("projectDetails", (project.id + project.updatedAt).toString());
  return project.icon;
};

// DELETE
const removeProjectIcon = async (projectId) => {
  const project = await projects.findById(projectId);
  if (!project) throw new Error("UnknownProject");
  project.icon = "";
  await project.save();

  io.emit("projects", (project.id + project.updatedAt).toString());
  io.emit("projectDetails", (project.id + project.updatedAt).toString());
};

const removeProjectCollaborator = async (
  projectId,
  collaboratorUsername,
  role
) => {
  let session = null;
  let notificationMsg, activityMsg;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const collaborator = await users
      .findOne({ username: collaboratorUsername })
      .select("projects notifications profilePic")
      .session(session);
    if (!collaborator) throw new Error("UnknownUser");

    const project = await projects
      .findById(projectId)
      .select(
        "name leader guide members invitations activities unavailableMembers"
      )
      .populate({
        path: "leader guide members invitations",
        select: "username to project",
      })
      .session(session);

    if (!project) throw new Error("UnknownProject");

    if (role === "guide" && project.guide?.username === collaboratorUsername) {
      project.guide = null;
      notificationMsg = `You are no longer a guide of the project ${project.name}.`;
      activityMsg = `${collaboratorUsername}, who was a guide of this project was removed by the leader ${project.leader?.username}`;
    } else if (
      role === "member" &&
      project.members?.some(
        (member) => member.username === collaboratorUsername
      )
    ) {
      project.members = project.members.filter(
        (member) => member.username !== collaboratorUsername
      );
      notificationMsg = `You are no longer a member of the project ${project.name}.`;
      activityMsg = `${collaboratorUsername}, who was a member of this project was removed by the leader ${project.leader?.username}`;
    } else {
      throw new Error("InvalidRole");
    }

    project.invitations = project.invitations.filter(
      (invitation) => invitation.to.toString() !== collaborator.id.toString()
    );

    const newNotification = await notifications.create(
      [
        {
          to: collaborator.id,
          from: project.leader.id,
          message: notificationMsg,
          type: "kickedFromProject",
        },
      ],
      { session }
    );

    collaborator.notifications.push(newNotification[0].id);

    const newActivity = await activities.create(
      [
        {
          entity: "project",
          project: projectId,
          message: activityMsg,
          image: collaborator.profilePic,
          type: "projectCollaboratorRemoved",
          read_users: [
            { readBy: project.leader.id, isRead: true },
            {
              readBy: collaborator.id,
              isRead: true,
            },
          ],
        },
      ],
      { session }
    );
    project.activities.push(newActivity[0].id);

    project.unavailableMembers = project.unavailableMembers.filter(
      (member) => member !== collaboratorUsername
    );

    collaborator.projects = collaborator.projects.filter(
      (project) => project.toString() !== projectId
    );

    await Promise.all([
      project.save({ session }),
      collaborator.save({ session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    io.emit("projectActivities", newActivity[0]._id);
    io.emit("notifications", newNotification[0]._id);
    io.emit("projects", (project.id + project.updatedAt).toString());
    io.emit("projectDetails", (project.id + project.updatedAt).toString());

    const socketIdOfCollaborator = connectedUsers[collaborator.id];
    io.to(socketIdOfCollaborator).emit("kickedFromProject", projectId);
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const removeProject = async (projectId) => {
  const removeEventId = uuidv4().replace(/-/g, "");

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const project = await projects
      .findById(projectId)
      .select("name leader guide members")
      .populate({
        path: "leader guide members",
        select: "username projects teams tasks notifications",
        populate: {
          path: "teams tasks",
          select: "parent grandParent",
        },
      })
      .session(session);

    if (!project) throw new Error("UnknownProject");

    project.leader.projects = project.leader.projects.filter(
      (project) => project.toString() !== projectId
    );

    project.leader.teams = project.leader.teams.filter(
      (team) => team.parent.toString() !== projectId
    );

    project.leader.tasks = project.leader.tasks.filter(
      (task) => task.grandParent.toString() !== projectId
    );

    if (project.guide) {
      project.guide.projects.filter(
        (project) => project.toString() !== projectId
      );
      project.guide.teams = project.guide.teams.filter(
        (team) => team.parent.toString() !== projectId
      );

      project.guide.tasks = project.guide.tasks.filter(
        (task) => task.grandParent.toString() !== projectId
      );
    }

    project.members.forEach((member) => {
      member.projects = member.projects.filter(
        (project) => project.toString() !== projectId
      );

      member.teams = member.teams.filter(
        (team) => team.parent.toString() !== projectId
      );

      member.tasks = member.tasks.filter(
        (task) => task.grandParent.toString() !== projectId
      );
    });

    teams.deleteMany({ parent: projectId }).session(session);
    tasks.deleteMany({ grandParent: projectId }).session(session);

    const notificationRecipients = [project.guide, ...project.members];

    for (const recipient of notificationRecipients) {
      if (recipient) {
        const newNotification = await notifications.create(
          [
            {
              to: recipient.id,
              type: "projectDeleted",
              from: project.leader.id,
              message: `The project ${project.name} is deleted by its leader ${project.leader.username}.`,
            },
          ],
          { session }
        );

        recipient.notifications.push(newNotification[0].id);
        await recipient.save({ session });
      }
    }

    await Promise.all([
      project.leader.save({ session }),
      project.guide?.save({ session }),
      project.members.forEach((member) => member.save({ session })),
      project.deleteOne({ session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    const connectedCollaboratorsSocketIds = [
      connectedUsers[project.leader.id],
      connectedUsers[project.guide?.id],
      ...project.members.map((member) => connectedUsers[member.id]),
    ];

    connectedCollaboratorsSocketIds.forEach((connectedCollaboratorSocketId) => {
      io.to(connectedCollaboratorSocketId).emit("teamDeleted");
      io.to(connectedCollaboratorSocketId).emit("projectDeleted");
    });

    io.emit("projects", removeEventId);
    io.emit("notifications", removeEventId);
  } catch (error) {
    console.log(error);

    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

module.exports = {
  createTeam,
  removeProject,
  setProjectIcon,
  getProjectTeams,
  getProjectDetails,
  removeProjectIcon,
  setProjectDetails,
  getProjectMembers,
  setProjectActivities,
  getProjectActivities,
  sendProjectInvitation,
  removeProjectCollaborator,
};
